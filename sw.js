// [e.leo] Service worker mínimo (requisito para instalar el sitio como app). No guarda nada en caché.
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(){});
