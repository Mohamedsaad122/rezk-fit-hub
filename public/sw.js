const CACHE_NAME = 'rezk-fit-hub-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/placeholder.svg',
    '/robots.txt'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Process static app shell caching or dynamic asset storage
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then((response) => {
                    if (event.request.method === 'GET' && 
                        (url.pathname.endsWith('.png') || 
                         url.pathname.endsWith('.svg') || 
                         url.pathname.endsWith('.ico') || 
                         url.pathname.endsWith('.js') || 
                         url.pathname.endsWith('.css'))) {
                        
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    }
                    return response;
                }).catch(() => {
                    // Fallback to offline index.html if request fails
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-queue') {
        event.waitUntil(
            self.clients.matchAll().then((clients) => {
                clients.forEach(client => {
                    client.postMessage({ type: 'SYNC_TRIGGER' });
                });
            })
        );
    }
});

self.addEventListener('push', (event) => {
    let data = { title: 'إشعار جديد', body: 'تحديث فوري من ريزك فيت هب' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data = { title: 'إشعار جديد', body: event.data.text() };
        }
    }
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/placeholder.svg'
        })
    );
});
