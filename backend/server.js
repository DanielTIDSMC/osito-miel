import { createHash, timingSafeEqual } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import webPush from 'web-push';

const MAX_REQUEST_BYTES = 12 * 1024 * 1024;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_PHOTOS_BYTES = 7 * 1024 * 1024;
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
    'placeRatings',
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

    if (data.placeRatings !== undefined && (
        !data.placeRatings || typeof data.placeRatings !== 'object' || Array.isArray(data.placeRatings) ||
        Object.keys(data.placeRatings).length > 1000 ||
        Object.entries(data.placeRatings).some(([id, entry]) =>
            !id || id.length > 200 || !entry || typeof entry !== 'object' || Array.isArray(entry) ||
            !entry.ratings || typeof entry.ratings !== 'object' || Array.isArray(entry.ratings) ||
            Object.keys(entry.ratings).length < 1 || Object.keys(entry.ratings).length > 4 ||
            Object.entries(entry.ratings).some(([category, score]) =>
                !['precios', 'sabor', 'atencion', 'menu'].includes(category) ||
                !Number.isInteger(score) || score < 1 || score > 5
            ) || typeof entry.updatedAt !== 'string' || !Number.isFinite(Date.parse(entry.updatedAt))
        )
    )) return false;

    let totalPhotoBytes = 0;
    for (const place of data.places || []) {
        if (!place || typeof place !== 'object' || typeof place.id !== 'string' ||
            typeof place.name !== 'string' || typeof place.date !== 'string' ||
            typeof place.note !== 'string' || (place.photo !== null && typeof place.photo !== 'string') ||
            (place.additionalPhotos !== undefined && (!Array.isArray(place.additionalPhotos) || place.additionalPhotos.length > 4 ||
                place.additionalPhotos.some((photo) => typeof photo !== 'string')))) return false;
        const photos = [...(place.photo === null ? [] : [place.photo]), ...(place.additionalPhotos || [])];
        if (photos.length > 5) return false;
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
                    placeRatings: {},
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

function isValidPushSubscription(subscription) {
    if (!subscription || typeof subscription !== 'object' || Array.isArray(subscription)) return false;
    if (typeof subscription.endpoint !== 'string' || subscription.endpoint.length > 2048) return false;
    try {
        if (new URL(subscription.endpoint).protocol !== 'https:') return false;
    } catch {
        return false;
    }
    return Boolean(
        subscription.keys &&
        typeof subscription.keys.p256dh === 'string' &&
        subscription.keys.p256dh.length <= 256 &&
        typeof subscription.keys.auth === 'string' &&
        subscription.keys.auth.length <= 128
    );
}

async function loadPushSubscriptions(filePath) {
    try {
        const saved = JSON.parse(await readFile(filePath, 'utf8'));
        return Array.isArray(saved)
            ? saved.filter((entry) =>
                entry && typeof entry.deviceId === 'string' && entry.deviceId.length <= 128 &&
                isValidPushSubscription(entry.subscription)
            )
            : [];
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

async function persistPushSubscriptions(filePath, subscriptions) {
    await mkdir(dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(subscriptions), { mode: 0o600 });
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
    let pushWriteQueue = Promise.resolve();
    let pushSubscriptionsTask = loadPushSubscriptions(`${normalizedDataFile}.push-subscriptions.json`);
    let vapidKeysTask = null;
    const pushSubscriptionsFile = `${normalizedDataFile}.push-subscriptions.json`;
    const vapidKeysFile = `${normalizedDataFile}.vapid.json`;
    const failedAttempts = new Map();
    const allowedOriginsSet = new Set(allowedOrigins);

    async function getVapidKeys() {
        if (!vapidKeysTask) {
            vapidKeysTask = (async () => {
                try {
                    const saved = JSON.parse(await readFile(vapidKeysFile, 'utf8'));
                    if (typeof saved.publicKey === 'string' && typeof saved.privateKey === 'string') return saved;
                } catch (error) {
                    if (error.code !== 'ENOENT') throw error;
                }
                const generated = webPush.generateVAPIDKeys();
                await mkdir(dirname(vapidKeysFile), { recursive: true });
                const temporaryPath = `${vapidKeysFile}.${process.pid}.tmp`;
                await writeFile(temporaryPath, JSON.stringify(generated), { mode: 0o600 });
                await rename(temporaryPath, vapidKeysFile);
                return generated;
            })();
        }
        return vapidKeysTask;
    }

    async function updatePushSubscriptions(transform) {
        let updated;
        const operation = pushWriteQueue.then(async () => {
            const current = await pushSubscriptionsTask;
            updated = transform(current);
            await persistPushSubscriptions(pushSubscriptionsFile, updated);
            pushSubscriptionsTask = Promise.resolve(updated);
        });
        pushWriteQueue = operation.catch(() => {});
        await operation;
        return updated;
    }

    async function notifyOtherDevices(senderDeviceId) {
        const subscriptions = await pushSubscriptionsTask;
        const recipients = subscriptions.filter((entry) => entry.deviceId !== senderDeviceId);
        if (!recipients.length) return;
        const keys = await getVapidKeys();
        webPush.setVapidDetails('https://danieltidsmc.github.io/osito-miel/', keys.publicKey, keys.privateKey);
        const payload = JSON.stringify({
            title: 'Un poquito de miel para ti',
            body: 'Osito subió algo nuevo a sus recuerdos. Entra a verlo 🧸🍯',
            url: './'
        });
        const expiredEndpoints = [];
        await Promise.all(recipients.map(async (entry) => {
            try {
                await webPush.sendNotification(entry.subscription, payload, { TTL: 300, urgency: 'normal' });
            } catch (error) {
                if (error.statusCode === 404 || error.statusCode === 410) {
                    expiredEndpoints.push(entry.subscription.endpoint);
                } else {
                    console.error('Push notification delivery failed:', error.statusCode || 'unknown status');
                }
            }
        }));
        if (expiredEndpoints.length) {
            await updatePushSubscriptions((current) =>
                current.filter((entry) => !expiredEndpoints.includes(entry.subscription.endpoint))
            );
        }
    }

    const server = createHttpServer(async (request, response) => {
        const originHeader = request.headers.origin || '';
        if (originHeader && !allowedOriginsSet.has(originHeader)) {
            jsonResponse(response, 403, { error: 'Origin not allowed' }, 'null');
            return;
        }
        const origin = originHeader || 'null';
        response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
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
        const isStateRoute = url.pathname === '/api/state' && ['GET', 'PUT'].includes(request.method);
        const isPushKeyRoute = url.pathname === '/api/push/public-key' && request.method === 'GET';
        const isPushSubscriptionRoute = url.pathname === '/api/push/subscriptions' && ['POST', 'DELETE'].includes(request.method);
        if (!isStateRoute && !isPushKeyRoute && !isPushSubscriptionRoute) {
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
            if (isPushKeyRoute) {
                const { publicKey } = await getVapidKeys();
                jsonResponse(response, 200, { publicKey }, origin);
                return;
            }

            if (isPushSubscriptionRoute) {
                const body = await readRequestBody(request);
                if (!body || typeof body.deviceId !== 'string' || !body.deviceId || body.deviceId.length > 128) {
                    jsonResponse(response, 400, { error: 'Invalid push device' }, origin);
                    return;
                }
                if (request.method === 'POST') {
                    if (!isValidPushSubscription(body.subscription)) {
                        jsonResponse(response, 400, { error: 'Invalid push subscription' }, origin);
                        return;
                    }
                    const existing = await pushSubscriptionsTask;
                    const isKnownDevice = existing.some((entry) => entry.deviceId === body.deviceId);
                    const remaining = existing.filter((entry) =>
                        entry.deviceId !== body.deviceId && entry.subscription.endpoint !== body.subscription.endpoint
                    );
                    if (!isKnownDevice && remaining.length >= 8) {
                        jsonResponse(response, 429, { error: 'This shared album already has the maximum number of devices' }, origin);
                        return;
                    }
                    await updatePushSubscriptions((current) => [
                        ...current.filter((entry) =>
                            entry.deviceId !== body.deviceId && entry.subscription.endpoint !== body.subscription.endpoint
                        ),
                        { deviceId: body.deviceId, subscription: body.subscription, updatedAt: new Date().toISOString() }
                    ]);
                    jsonResponse(response, 200, { status: 'subscribed' }, origin);
                    return;
                }
                await updatePushSubscriptions((current) => current.filter((entry) => entry.deviceId !== body.deviceId));
                jsonResponse(response, 200, { status: 'unsubscribed' }, origin);
                return;
            }

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
            if (!updateError) {
                void notifyOtherDevices(typeof body.deviceId === 'string' ? body.deviceId : '').catch((error) => {
                    console.error('Could not deliver shared-memory notifications:', error.message);
                });
            }
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
