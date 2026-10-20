const V='cm-v4';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png','fonts/caveat-latin-500-normal.woff2','fonts/caveat-latin-600-normal.woff2','fonts/ibm-plex-sans-latin-400-normal.woff2','fonts/ibm-plex-sans-latin-500-normal.woff2','fonts/ibm-plex-mono-latin-400-normal.woff2','fonts/ibm-plex-mono-latin-500-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Todo sale primero de la copia guardada en el teléfono: la app abre al instante, con o sin internet, aunque la red sea lenta o no responda.
// Cuando hay red, la página se actualiza en segundo plano (con un límite de tiempo) y la versión nueva se ve la siguiente vez que abrís la app.
function ok(r){return r&&r.ok&&r.type==='basic'&&!r.redirected}
function refresh(){
  const t=new AbortController(),timer=setTimeout(()=>t.abort(),15000);
  return fetch('index.html',{cache:'reload',signal:t.signal}).then(r=>{
    clearTimeout(timer);
    if(!ok(r))return;
    return caches.open(V).then(c=>Promise.all([c.put('index.html',r.clone()),c.put('./',r)]));
  }).catch(()=>{clearTimeout(timer)});
}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||e.request.destination==='document';
  if(isPage){
    e.respondWith(
      caches.match('index.html').then(hit=>{
        if(hit){e.waitUntil(refresh());return hit}
        return fetch(e.request).then(r=>{if(ok(r)){const c=r.clone();caches.open(V).then(x=>x.put('index.html',c))}return r});
      })
    );
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
