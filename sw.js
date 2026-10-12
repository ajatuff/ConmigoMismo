const V='cm-v1';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png','fonts/caveat-latin-500-normal.woff2','fonts/caveat-latin-600-normal.woff2','fonts/ibm-plex-sans-latin-400-normal.woff2','fonts/ibm-plex-sans-latin-500-normal.woff2','fonts/ibm-plex-mono-latin-400-normal.woff2','fonts/ibm-plex-mono-latin-500-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
