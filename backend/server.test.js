import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { createSyncServer } from './server.js';

const roomPassword = 'unit-test-room-password-keep-private';
let temporaryDirectory;
let server;
let baseUrl;

before(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'osito-miel-sync-'));
    server = createSyncServer({
        password: roomPassword,
        dataFile: join(temporaryDirectory, 'data', 'state.json'),
        allowedOrigins: ['https://danieltidsmc.github.io']
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await rm(temporaryDirectory, { recursive: true, force: true });
});

test('serves health checks and protects shared data with the room password', async () => {
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    const unauthorized = await fetch(`${baseUrl}/api/state`);
    assert.equal(unauthorized.status, 401);
    const forbiddenOrigin = await fetch(`${baseUrl}/api/state`, {
        headers: { Origin: 'https://untrusted.example', Authorization: `Bearer ${roomPassword}` }
    });
    assert.equal(forbiddenOrigin.status, 403);
});

test('saves shared state and rejects stale writes without losing data', async () => {
    const headers = {
        Authorization: `Bearer ${roomPassword}`,
        'Content-Type': 'application/json',
        Origin: 'https://danieltidsmc.github.io'
    };
    const initialResponse = await fetch(`${baseUrl}/api/state`, { headers });
    const initial = await initialResponse.json();
    assert.equal(initial.revision, 0);
    const next = {
        ...initial,
        data: {
            ...initial.data,
            memories: [{ text: 'Recuerdo de prueba', date: '2026-10-07' }],
            deletedPlaceIds: ['place-deleted'],
            dateStates: { 'sunset-picnic': { saved: false, completed: true, updatedAt: '2026-10-07T00:00:00.000Z' } }
        }
    };
    const savedResponse = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(next)
    });
    assert.equal(savedResponse.status, 200);
    const staleResponse = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(next)
    });
    assert.equal(staleResponse.status, 409);
    const remote = await fetch(`${baseUrl}/api/state`, { headers }).then((response) => response.json());
    assert.equal(remote.revision, 1);
    assert.equal(remote.data.memories[0].text, 'Recuerdo de prueba');
    assert.deepEqual(remote.data.deletedPlaceIds, ['place-deleted']);
    assert.equal(remote.data.dateStates['sunset-picnic'].completed, true);
    const disk = JSON.parse(await readFile(join(temporaryDirectory, 'data', 'state.json'), 'utf8'));
    assert.equal(disk.revision, 1);
});

test('rejects non-image and oversized album data', async () => {
    const headers = {
        Authorization: `Bearer ${roomPassword}`,
        'Content-Type': 'application/json'
    };
    const current = await fetch(`${baseUrl}/api/state`, { headers }).then((response) => response.json());
    const invalidPhotoState = {
        ...current,
        data: {
            ...current.data,
            places: [{
                id: 'place-1',
                name: 'Lugar',
                date: '2026-10-07',
                note: '',
                photo: 'data:text/plain;base64,SGVsbG8='
            }]
        }
    };
    const response = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(invalidPhotoState)
    });
    assert.equal(response.status, 400);
});
