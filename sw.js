const V='cm-v3';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png','fonts/caveat-latin-500-normal.woff2','fonts/caveat-latin-600-normal.woff2','fonts/ibm-plex-sans-latin-400-normal.woff2','fonts/ibm-plex-sans-latin-500-normal.woff2','fonts/ibm-plex-mono-latin-400-normal.woff2','fonts/ibm-plex-mono-latin-500-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// La página se pide primero a la red (para recibir actualizaciones) y, sin internet, sale de la copia guardada.
// Fuentes e íconos salen de la copia guardada primero.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||e.request.destination==='document';
  if(isPage){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
