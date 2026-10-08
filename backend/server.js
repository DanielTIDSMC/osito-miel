import { createHash, timingSafeEqual } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_REQUEST_BYTES = 12 * 1024 * 1024;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_PHOTOS_BYTES = 9 * 1024 * 1024;
const ALLOWED_DATA_KEYS = new Set([
    'memories',
    'dateIdeas',
    'savedDateIds',
    'pickedDateId',
    'completedDateIds',
    'dailyAnswers',
    'anniversary',
    'places',
    'deletedPlaceIds',
    'placeOverrides',
    'dateStates'
]);

function jsonResponse(response, status, body, origin) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': origin,
        'Vary': 'Origin'
    });
    response.end(JSON.stringify(body));
}

function sameSecret(provided, expected) {
    if (typeof provided !== 'string' || !provided || !expected) return false;
    const providedHash = createHash('sha256').update(provided).digest();
    const expectedHash = createHash('sha256').update(expected).digest();
    return timingSafeEqual(providedHash, expectedHash);
}

function validateData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    if (Object.keys(data).some((key) => !ALLOWED_DATA_KEYS.has(key))) return false;
    for (const key of ['memories', 'dateIdeas', 'savedDateIds', 'completedDateIds', 'dailyAnswers', 'places', 'deletedPlaceIds']) {
        if (data[key] !== undefined && (!Array.isArray(data[key]) || data[key].length > 1000)) return false;
    }
    if (data.dateStates !== undefined && (
        !data.dateStates || typeof data.dateStates !== 'object' || Array.isArray(data.dateStates) ||
        Object.keys(data.dateStates).length > 1000 ||
        Object.values(data.dateStates).some((state) =>
            !state || typeof state.saved !== 'boolean' || typeof state.completed !== 'boolean' ||
            typeof state.updatedAt !== 'string'
        )
    )) return false;
    if (data.placeOverrides !== undefined && (
        !data.placeOverrides || typeof data.placeOverrides !== 'object' || Array.isArray(data.placeOverrides) ||
        Object.keys(data.placeOverrides).length > 1000 ||
        Object.entries(data.placeOverrides).some(([id, date]) =>
            !id || id.length > 200 || typeof date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date
        )
    )) return false;

    let totalPhotoBytes = 0;
    for (const place of data.places || []) {
        if (!place || typeof place !== 'object' || typeof place.id !== 'string' ||
            typeof place.name !== 'string' || typeof place.date !== 'string' ||
            typeof place.note !== 'string' || (place.photo !== null && typeof place.photo !== 'string') ||
            (place.additionalPhotos !== undefined && (!Array.isArray(place.additionalPhotos) || place.additionalPhotos.length > 20 ||
                place.additionalPhotos.some((photo) => typeof photo !== 'string')))) return false;
        const photos = [...(place.photo === null ? [] : [place.photo]), ...(place.additionalPhotos || [])];
        for (const photo of photos) {
            const photoMatch = /^data:image\/jpeg;base64,([A-Za-z0-9+/]*={0,2})$/.exec(photo);
            if (!photoMatch) return false;
            const photoBytes = Math.floor(photoMatch[1].length * 3 / 4);
            if (photoBytes > MAX_PHOTO_BYTES) return false;
            totalPhotoBytes += photoBytes;
            if (totalPhotoBytes > MAX_PHOTOS_BYTES) return false;
        }
    }
    return true;
}

async function readRequestBody(request) {
    const contentLength = Number(request.headers['content-length'] || 0);
    if (contentLength > MAX_REQUEST_BYTES) throw Object.assign(new Error('Request too large'), { status: 413 });
    const chunks = [];
    let bytes = 0;
    for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > MAX_REQUEST_BYTES) throw Object.assign(new Error('Request too large'), { status: 413 });
        chunks.push(chunk);
    }
    try {
        return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
        throw Object.assign(new Error('Invalid JSON body'), { status: 400 });
    }
}

async function loadState(filePath) {
    try {
        const saved = JSON.parse(await readFile(filePath, 'utf8'));
        if (!Number.isSafeInteger(saved.revision) || saved.revision < 0 ||
            typeof saved.updatedAt !== 'string' || !validateData(saved.data)) {
            throw new Error('El archivo de sincronización tiene un formato inválido.');
        }
        return saved;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {
                revision: 0,
                updatedAt: '',
                data: {
                    memories: [],
                    dateIdeas: [],
                    savedDateIds: [],
                    pickedDateId: null,
                    completedDateIds: [],
                    dailyAnswers: [],
                    anniversary: '',
                    places: [],
                    deletedPlaceIds: [],
                    placeOverrides: {},
                    dateStates: {}
                }
            };
        }
        throw error;
    }
}

async function persistState(filePath, state) {
    await mkdir(dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(state), { mode: 0o600 });
    await rename(temporaryPath, filePath);
}

export function createSyncServer({
    password,
    dataFile = resolve(process.env.DATA_FILE || join(process.cwd(), 'data', 'state.json')),
    allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://danieltidsmc.github.io,http://127.0.0.1:4173,http://localhost:4173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
} = {}) {
    if (typeof password !== 'string' || Buffer.byteLength(password) < 24) {
        throw new Error('ROOM_PASSWORD must be set to a random secret of at least 24 bytes.');
    }

    const normalizedDataFile = resolve(dataFile);
    let stateTask = loadState(normalizedDataFile);
    let writeQueue = Promise.resolve();
    const failedAttempts = new Map();
    const allowedOriginsSet = new Set(allowedOrigins);

    const server = createHttpServer(async (request, response) => {
        const originHeader = request.headers.origin || '';
        if (originHeader && !allowedOriginsSet.has(originHeader)) {
            jsonResponse(response, 403, { error: 'Origin not allowed' }, 'null');
            return;
        }
        const origin = originHeader || 'null';
        response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        response.setHeader('Access-Control-Max-Age', '600');
        if (request.method === 'OPTIONS') {
            response.writeHead(204, { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' });
            response.end();
            return;
        }

        const url = new URL(request.url, 'http://localhost');
        if (request.method === 'GET' && url.pathname === '/health') {
            jsonResponse(response, 200, { status: 'ok' }, origin);
            return;
        }
        if (url.pathname !== '/api/state' || !['GET', 'PUT'].includes(request.method)) {
            jsonResponse(response, 404, { error: 'Not found' }, origin);
            return;
        }

        const authorization = request.headers.authorization || '';
        const providedPassword = authorization.startsWith('Bearer ')
            ? authorization.slice('Bearer '.length)
            : '';
        const now = Date.now();
        const clientAddress = request.socket.remoteAddress || 'unknown';
        const previousFailures = failedAttempts.get(clientAddress) || { count: 0, until: 0 };
        if (previousFailures.until > now && previousFailures.count >= 10) {
            jsonResponse(response, 429, { error: 'Too many attempts; try again later' }, origin);
            return;
        }
        if (!sameSecret(providedPassword, password)) {
            const nextFailures = previousFailures.until > now
                ? { count: previousFailures.count + 1, until: previousFailures.until }
                : { count: 1, until: now + 15 * 60 * 1000 };
            failedAttempts.set(clientAddress, nextFailures);
            jsonResponse(response, 401, { error: 'Unauthorized' }, origin);
            return;
        }
        failedAttempts.delete(clientAddress);

        try {
            if (request.method === 'GET') {
                const current = await stateTask;
                if (url.searchParams.get('metadata') === '1') {
                    jsonResponse(response, 200, { revision: current.revision, updatedAt: current.updatedAt }, origin);
                } else {
                    jsonResponse(response, 200, current, origin);
                }
                return;
            }
            const body = await readRequestBody(request);
            if (!body || !Number.isSafeInteger(body.revision) || body.revision < 0 || !validateData(body.data)) {
                jsonResponse(response, 400, { error: 'Invalid shared data' }, origin);
                return;
            }

            let result;
            let updateError;
            let updateFailure;
            const writeOperation = writeQueue.then(async () => {
                const current = await stateTask;
                if (body.revision !== current.revision) {
                    result = current;
                    updateError = true;
                    return;
                }
                const nextState = {
                    revision: current.revision + 1,
                    updatedAt: new Date().toISOString(),
                    data: body.data
                };
                await persistState(normalizedDataFile, nextState);
                stateTask = Promise.resolve(nextState);
                result = nextState;
                updateError = false;
            });
            writeQueue = writeOperation.catch((error) => {
                updateFailure = error;
            });
            await writeQueue;
            if (updateFailure) throw updateFailure;
            jsonResponse(response, updateError ? 409 : 200, result, origin);
        } catch (error) {
            if (error.status) {
                jsonResponse(response, error.status, { error: error.message }, origin);
                return;
            }
            console.error('Sync API request failed:', error);
            jsonResponse(response, 500, { error: 'Internal server error' }, origin);
        }
    });
    return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const server = createSyncServer({ password: process.env.ROOM_PASSWORD });
    const port = Number(process.env.PORT || 3000);
    server.listen(port, '0.0.0.0', () => console.log(`Osito Miel sync API listening on ${port}`));
}
