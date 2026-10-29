// Service Worker de Difuminar: guarda la app para que funcione sin internet.
// Cambia CACHE_NAME en cada versión nueva.
const CACHE_NAME = 'difuminar-v25';

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './ai.js',
    './manifest.json',
    './logo1.jpg',
    './icon.png',
    './icon-192.png',
    './icon-maskable.png',
    './apple-touch-icon.png',
    './favicon.png',
    './vision_bundle.js',
    './vision_wasm_internal.js',
    './vision_wasm_internal.wasm',
    './face_landmarker.task',
    './selfie_segmenter.tflite',
    './fonts.css',
    './fontawesome.min.css',
    './solid.min.css',
    './fa-solid-900.woff2',
    './inter-latin-400-normal.woff2',
    './inter-latin-500-normal.woff2',
    './inter-latin-600-normal.woff2',
    './inter-latin-700-normal.woff2',
    './inter-latin-800-normal.woff2',
    './exifr.full.umd.js',
    './jspdf.umd.min.js',
    './jspdf.plugin.autotable.min.js',
    './xlsx.full.min.js',
    './pdf.min.js',
    './pdf.worker.min.js',
    './textstyles.js',
    './textfonts.css',
    './fredoka-latin-700-normal.woff2',
    './anton-latin-400-normal.woff2',
    './bebas-neue-latin-400-normal.woff2',
    './pacifico-latin-400-normal.woff2',
    './dancing-script-latin-700-normal.woff2',
    './playfair-display-latin-400-normal.woff2',
    './playfair-display-latin-400-italic.woff2',
    './playfair-display-latin-700-normal.woff2',
    './special-elite-latin-400-normal.woff2',
    './permanent-marker-latin-400-normal.woff2',
    './bangers-latin-400-normal.woff2',
    './lobster-latin-400-normal.woff2',
    './caveat-latin-700-normal.woff2',
    './docx.umd.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(ASSETS.map(url => cache.add(url).catch(e => console.warn('No se pudo guardar', url, e))))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Página, código y estilos propios: primero internet (para recibir mejoras); sin conexión, la copia guardada.
// Modelos, librerías, fuentes e imágenes: primero la copia guardada (más rápido).
self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    const heavy = /\.(wasm|task|tflite|woff2|png|jpg)$/.test(url.pathname) || /(vision_bundle|vision_wasm_internal|\.min|umd)\.js$/.test(url.pathname) || /(fonts|fontawesome\.min|solid\.min)\.css$/.test(url.pathname);
    const isCode = req.mode === 'navigate' || (!heavy && /\.(html|js|css|json)$/.test(url.pathname));

    const saveCopy = res => {
        if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
    };

    if (isCode) {
        event.respondWith(
            fetch(req).then(saveCopy).catch(() =>
                caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))
            )
        );
    } else {
        event.respondWith(
            caches.match(req, { ignoreSearch: true }).then(cached => cached || fetch(req).then(saveCopy))
        );
    }
});
