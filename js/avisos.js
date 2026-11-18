// Avisos al celular (notificaciones push) de En el Ensayo Media — copiado de OKpolítico y adaptado. [.leon 2026-11-18]
// La gente decide: el permiso del navegador SOLO se pide al tocar «Activar». Gratis, sin correo ni registro. Máx. 3 avisos al día, solo noticias grandes.
(function () {
  var A = 'https://eem-avisos.enelensayomedia.workers.dev', NS = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx2/';
  function g(k) { try { return localStorage[k] } catch (e) { return null } }
  function s(k, v) { try { localStorage[k] = v } catch (e) { } }
  function h(x) { try { fetch(NS + x, { mode: 'no-cors', keepalive: true }) } catch (e) { } }
  var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua);
  var inst = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  var ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var enApp = /FBAN|FBAV|Instagram|Telegram|TikTok|Twitter|Line\//i.test(ua);       // navegadores dentro de apps: no permiten alertas
  var st = document.createElement('style');
  st.textContent = '.av-card{position:fixed;right:14px;bottom:14px;z-index:400;width:min(340px,calc(100% - 28px));background:#15101f;color:#f4f1ea;border:1px solid rgba(255,235,59,.5);border-radius:16px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.5);font:14px/1.4 system-ui,sans-serif}'
    + '.av-card b.av-t{display:block;font-size:15px;margin-bottom:6px;color:#ffeb3b}.av-card ol{margin:6px 0 6px 18px;padding:0}.av-card li{margin:4px 0}.av-card p{margin:6px 0}.av-nota{opacity:.7;font-size:12px}'
    + '.av-b{display:flex;gap:8px;margin-top:10px}.av-b button{flex:1;padding:10px;border-radius:10px;border:0;font-weight:800;cursor:pointer}.av-si{background:#ffeb3b;color:#111}.av-no{background:rgba(255,255,255,.1);color:#fff}'
    + 'button.av-abrir{background:transparent;color:inherit;border:1px solid rgba(255,255,255,.3);border-radius:99px;padding:7px 12px;font:700 13px/1 inherit;cursor:pointer;margin-left:10px;white-space:nowrap}';
  document.head.appendChild(st);
  function b64(x) { x = x.replace(/-/g, '+').replace(/_/g, '/'); x += '===='.slice(x.length % 4 || 4); var r = atob(x), o = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) o[i] = r.charCodeAt(i); return o }
  function pasos(l) { return '<ol>' + l.map(function (x) { return '<li>' + x + '</li>' }).join('') + '</ol>' }
  function activar(c) {
    var m = c.querySelector('.av-est'); m.hidden = false; m.textContent = 'Toca «Permitir» en la ventana que apareció.';
    Notification.requestPermission().then(function (p) {
      if (p !== 'granted') { m.textContent = 'No se activaron. Puedes intentarlo después con 🔔 Avisos.'; return; }
      return fetch(A + '/clave').then(function (r) { return r.json() }).then(function (k) {
        return navigator.serviceWorker.ready.then(function (w) { return w.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.clave) }) });
      }).then(function (sub) {
        return fetch(A + '/alta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub.toJSON(), temas: ['ultima'] }) }).then(function (r) { return r.json() });
      }).then(function (j) {
        if (j && j.ok) { s('eem_av', 'si'); h('avisos-alta'); m.textContent = '✅ Listo. Te avisaremos de las noticias grandes.'; setTimeout(function () { c.remove() }, 2500); }
        else m.textContent = 'No se pudo activar. Intenta de nuevo en un rato.';
      });
    }).catch(function () { m.textContent = 'No se pudo activar en este navegador.'; });
  }
  function tarjeta(manual) {
    if (!manual && g('eem_av')) return;
    var v = document.querySelector('.av-card'); if (v) v.remove();
    var pide = ios && !inst, ya = ok && Notification.permission === 'granted' && g('eem_av') === 'si', neg = ok && Notification.permission === 'denied';
    var t = 'Recibe las noticias grandes al momento', m, si = false, fin = 'Ahora no';
    if (enApp) { t = 'Primero abre el sitio en tu navegador'; m = pasos(['Toca los <b>tres puntos</b> (⋯ o ⋮) de una esquina.', 'Elige <b>Abrir en ' + (ios ? 'Safari' : 'Chrome') + '</b>.', 'Ahí toca <b>🔔 Avisos</b>.']); fin = 'Entendido'; }
    else if (pide) { t = 'En iPhone son 4 pasos'; m = pasos(['Toca el botón <b>Compartir</b> del navegador (cuadro con flecha hacia arriba).', 'Baja y toca <b>Agregar a inicio</b>.', 'Abre <b>En El Ensayo</b> desde tu pantalla de inicio.', 'Toca <b>🔔 Avisos</b> y luego <b>Activar</b>.']); fin = 'Entendido'; }
    else if (ya) { t = 'Ya tienes los avisos activos'; m = '<p>No tienes que hacer nada más.</p>'; fin = 'Cerrar'; }
    else if (neg) { t = 'Tu navegador tiene los avisos bloqueados'; m = '<p>Activa las notificaciones de <b>enelensayomedia.com</b> en los ajustes del navegador y vuelve a intentarlo.</p>'; fin = 'Entendido'; }
    else if (!ok) { t = 'Este navegador no permite avisos'; m = '<p>Abre el sitio en ' + (ios ? 'Safari' : 'Chrome') + ' y toca <b>🔔 Avisos</b>.</p>'; fin = 'Entendido'; }
    else { si = true; m = '<p>Solo noticias grandes y últimas horas. Máximo 3 al día.</p><p class="av-nota">Gratis, sin correo ni registro. Puedes desactivarlos cuando quieras.</p>'; }
    var c = document.createElement('div'); c.className = 'av-card'; c.setAttribute('role', 'dialog');
    c.innerHTML = '<b class="av-t">' + t + '</b><div class="av-m">' + m + '</div><p class="av-est" hidden></p><div class="av-b">' + (si ? '<button class="av-si">Activar avisos</button>' : '') + '<button class="av-no">' + fin + '</button></div>';
    document.body.appendChild(c);
    c.querySelector('.av-no').onclick = function () { if (!g('eem_av')) s('eem_av', 'despues'); c.remove(); };
    var y = c.querySelector('.av-si'); if (y) y.onclick = function () { activar(c); };
  }
  // botón 🔔 en la barra (sin tocar el HTML de las páginas)
  function boton() {
    var nav = document.querySelector('.navbar .nav-inner') || document.querySelector('.navbar'); if (!nav || nav.querySelector('.av-abrir')) return;
    var b = document.createElement('button'); b.className = 'av-abrir'; b.type = 'button'; b.setAttribute('data-alertas', ''); b.textContent = '🔔 Avisos';
    var burger = nav.querySelector('.nav-burger'); if (burger) nav.insertBefore(b, burger); else nav.appendChild(b);
  }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-alertas]')) tarjeta(true); });
  boton();
  var n = +(g('eem_vis') || 0) + 1; s('eem_vis', n);
  if (!inst || ios) setTimeout(tarjeta, n > 1 ? 6000 : 30000);              // la 1.ª visita espera 30 s; después, 6 s
})();
