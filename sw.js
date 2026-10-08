const CACHE_NAME = 'osito-miel-shell-v22';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css?v=ratings-v1',
    './app.js?v=ratings-v1',
    './manifest.json',
    './assets/icons/icon.svg',
    './assets/places/visited.json?v=ratings-v1',
    './assets/places/puerquito-valiente.jpg',
    './assets/places/senor-bamboo.jpg',
    './assets/places/picnic-1.jpg',
    './assets/places/picnic-2.jpg',
    './assets/places/picnic-3.jpg',
    './assets/places/picnic-4.jpg',
    './assets/places/pizza-angelotti.jpg',
    './assets/places/papaluchon-1.jpg',
    './assets/places/papaluchon-2.jpg',
    './assets/places/papaluchon-3.jpg',
    './assets/places/papaluchon-4.jpg',
    './assets/places/papaluchon-5.jpg',
    './assets/places/papaluchon-6.jpg',
    './assets/places/triangulos-1.jpg',
    './assets/places/triangulos-2.jpg',
    './assets/places/triangulos-3.jpg',
    './assets/places/granel-mas.jpg',
    './assets/places/restaurante-601.jpg',
    './assets/places/madisson-grill.jpg',
    './assets/places/cafe-country.jpg',
    './assets/places/comida-japonesa.jpg',
    './assets/places/cafe-ripoll-1.jpg',
    './assets/places/cafe-ripoll-2.jpg',
    './assets/places/cafe-ripoll-3.jpg',
    './assets/places/cafe-ripoll-4.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key.startsWith('osito-miel-') && key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
                    }
                    return response;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            });
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || './';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                const existingClient = clients.find((client) => client.url === targetUrl);
                if (existingClient) return existingClient.focus();
                return self.clients.openWindow(targetUrl);
            })
    );
});


self.addEventListener('push', (event) => {
    let payload = {};
    try { payload = event.data ? event.data.json() : {}; } catch {}
    event.waitUntil(self.registration.showNotification(payload.title || 'Un poquito de miel para ti', {
        body: payload.body || 'Osito subi? algo nuevo a sus recuerdos.',
        icon: './assets/icons/icon.svg',
        badge: './assets/icons/icon.svg',
        data: { url: new URL(payload.url || './', self.location.href).href }
    }));
});
