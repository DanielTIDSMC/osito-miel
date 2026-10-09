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
            placeOverrides: { 'chat-cafeteria-fortin': '2026-06-26' },
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
    assert.deepEqual(remote.data.placeOverrides, { 'chat-cafeteria-fortin': '2026-06-26' });
    assert.equal(remote.data.dateStates['sunset-picnic'].completed, true);
    const disk = JSON.parse(await readFile(join(temporaryDirectory, 'data', 'state.json'), 'utf8'));
    assert.equal(disk.revision, 1);
});

test('shares Pooh suggestions and rejects malformed suggestions', async () => {
    const headers = {
        Authorization: `Bearer ${roomPassword}`,
        'Content-Type': 'application/json',
        Origin: 'https://danieltidsmc.github.io'
    };
    const current = await fetch(`${baseUrl}/api/state`, { headers }).then((response) => response.json());
    const suggestion = {
        id: 'pooh-suggestion-test',
        text: 'Un mapita ilustrado de nuestros paseos',
        createdAt: '2026-10-09T12:00:00.000Z'
    };
    const savedResponse = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...current,
            data: { ...current.data, poohSuggestions: [...(current.data.poohSuggestions || []), suggestion] }
        })
    });
    assert.equal(savedResponse.status, 200);
    const saved = await savedResponse.json();
    assert.deepEqual(saved.data.poohSuggestions.at(-1), suggestion);

    const invalidResponse = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...saved,
            data: { ...saved.data, poohSuggestions: [{ ...suggestion, id: 'empty-suggestion', text: '   ' }] }
        })
    });
    assert.equal(invalidResponse.status, 400);
});

test('protects push registration and only accepts valid subscriptions', async () => {
    const headers = {
        Authorization: 'Bearer ' + roomPassword,
        'Content-Type': 'application/json',
        Origin: 'https://danieltidsmc.github.io'
    };
    const unauthorized = await fetch(baseUrl + '/api/push/public-key');
    assert.equal(unauthorized.status, 401);
    const keyResponse = await fetch(baseUrl + '/api/push/public-key', { headers });
    assert.equal(keyResponse.status, 200);
    const { publicKey } = await keyResponse.json();
    assert.ok(publicKey.length > 40);
    const invalidSubscription = await fetch(baseUrl + '/api/push/subscriptions', {
        method: 'POST', headers,
        body: JSON.stringify({ deviceId: 'test-device', subscription: { endpoint: 'https://push.example.test/a', keys: {} } })
    });
    assert.equal(invalidSubscription.status, 400);
});

test('rejects invalid imported-place date overrides', async () => {
    const headers = {
        Authorization: `Bearer ${roomPassword}`,
        'Content-Type': 'application/json',
        Origin: 'https://danieltidsmc.github.io'
    };
    const current = await fetch(`${baseUrl}/api/state`, { headers }).then((response) => response.json());
    const response = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...current,
            data: { ...current.data, placeOverrides: { 'chat-cafeteria-fortin': '2026-02-30' } }
        })
    });
    assert.equal(response.status, 400);
});

test('accepts shared places without an attached photo', async () => {
    const headers = {
        Authorization: `Bearer ${roomPassword}`,
        'Content-Type': 'application/json',
        Origin: 'https://danieltidsmc.github.io'
    };
    const current = await fetch(`${baseUrl}/api/state`, { headers }).then((response) => response.json());
    const response = await fetch(`${baseUrl}/api/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...current,
            data: {
                ...current.data,
                places: [{
                    id: 'place-without-photo',
                    name: 'Lugar sin foto',
                    date: '',
                    note: '',
                    photo: null
                }]
            }
        })
    });
    assert.equal(response.status, 200);
    const saved = await response.json();
    assert.equal(saved.data.places[0].photo, null);
});

test('limits each shared place to five photos', async () => {
    const headers = { Authorization: 'Bearer ' + roomPassword, 'Content-Type': 'application/json' };
    const current = await fetch(baseUrl + '/api/state', { headers }).then((response) => response.json());
    const photos = Array.from({ length: 6 }, () => 'data:image/jpeg;base64,AAAA');
    const response = await fetch(baseUrl + '/api/state', {
        method: 'PUT', headers,
        body: JSON.stringify({ ...current, data: { ...current.data, places: [{ id: 'too-many', name: 'Place', date: '', note: '', photo: photos[0], additionalPhotos: photos.slice(1) }] } })
    });
    assert.equal(response.status, 400);
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
