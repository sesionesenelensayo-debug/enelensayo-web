// Service worker de En el Ensayo Media: requisito para instalar el sitio como app y para recibir avisos al celular (push). No guarda nada en caché. [.leon 2026-11-18]
const API = 'https://eem-avisos.enelensayomedia.workers.dev';
self.addEventListener('install', function () { self.skipWaiting() });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()) });
self.addEventListener('fetch', function () { });
// El aviso llega vacío; el texto se pide a /ultimo (así no hace falta cifrar contenido)
self.addEventListener('push', function (e) {
  e.waitUntil(fetch(API + '/ultimo', { cache: 'no-store' }).then(function (r) { return r.json() }).catch(function () { return {} }).then(function (d) {
    return self.registration.showNotification(d.titulo || 'En el Ensayo Media', { body: d.cuerpo || 'Hay una nota nueva', icon: '/img/icon-192.png', badge: '/img/icon-192.png', data: { url: d.url || '/' }, tag: 'eem-ultimo' });
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var u = new URL((e.notification.data && e.notification.data.url) || '/', location.origin);
  u.searchParams.set('utm_source', 'notificacion');
  e.waitUntil(clients.openWindow(u.toString()));
});
