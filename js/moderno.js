// moderno.js — [e.leo] foco del cursor, tarjetas con luz interior, inclinación 3D sutil, botones magnéticos, aparición escalonada.
// Todo es mejora progresiva: si algo falla, el sitio sigue igual. Respeta «reducir movimiento» y pantallas táctiles.
(function () {
  'use strict';
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SEL = '.sx-card,.caja,.otra,.per-caja,.cuenta,.secciones-grid a,.gr-cols>div,.t10-lista li,.destacada-sx';

  // Foco suave que sigue al cursor (solo con ratón)
  if (fino && !quieto) {
    var foco = document.createElement('div'); foco.id = 'mx-foco'; document.body.appendChild(foco);
    var x = 0, y = 0, fx = 0, fy = 0, vivo = false;
    addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; if (!vivo) { vivo = true; fx = x; fy = y; document.body.classList.add('mx-activo'); requestAnimationFrame(paso); } }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('mx-activo'); vivo = false; });
    function paso() {
      if (!vivo) return;
      fx += (x - fx) * .12; fy += (y - fy) * .12;
      foco.style.transform = 'translate3d(' + fx + 'px,' + fy + 'px,0)';
      requestAnimationFrame(paso);
    }
  }

  // Luz interior de cada tarjeta + inclinación 3D (delegación: sirve para tarjetas que se crean después, con fetch)
  var tilt = null;
  document.addEventListener('pointermove', function (e) {
    if (!fino) return;
    var c = e.target.closest && e.target.closest(SEL);
    if (tilt && tilt !== c) { tilt.style.transform = ''; tilt = null; }
    if (!c) return;
    var r = c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    c.style.setProperty('--mx', px + 'px'); c.style.setProperty('--my', py + 'px');
    if (quieto || !c.matches('.sx-card,.destacada-sx,.secciones-grid a')) return;
    var rx = ((py / r.height) - .5) * -5, ry = ((px / r.width) - .5) * 5;
    c.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    tilt = c;
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (tilt) { tilt.style.transform = ''; tilt = null; } }, true);

  // Botones magnéticos
  if (fino && !quieto) {
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.platform-btn,a.b,.tg,.btn');
      document.querySelectorAll('.mx-mag').forEach(function (m) { if (m !== b) { m.style.transform = ''; m.classList.remove('mx-mag'); } });
      if (!b) return;
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px)';
      b.classList.add('mx-mag');
    }, { passive: true });
  }

  // Aparición escalonada de tarjetas nuevas (las que dibuja el JS de cada sección)
  if (!quieto && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { var t = en.target; t.classList.add('mx-in'); io.unobserve(t); setTimeout(function () { t.classList.remove('mx-pre', 'mx-in'); }, 1500); } });   // libera la transición para que la inclinación sea inmediata
    }, { threshold: .06, rootMargin: '0px 0px -6% 0px' });
    var visto = new WeakSet();
    var barrer = function () {
      document.querySelectorAll('.sx-card,.otra,.cuenta,.t10-lista li').forEach(function (el) {
        if (visto.has(el)) return; visto.add(el);
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--mx-d', Math.min(i, 8) * 60 + 'ms');
        el.classList.add('mx-pre'); io.observe(el);
      });
    };
    barrer();
    new MutationObserver(function () { barrer(); }).observe(document.body, { childList: true, subtree: true });
    var st = document.createElement('style');
    st.textContent = '.mx-pre{opacity:0;transform:translateY(26px) scale(.98)}.mx-pre.mx-in{opacity:1;transform:none;transition:opacity .7s var(--ease) var(--mx-d,0ms),transform .8s var(--ease) var(--mx-d,0ms)!important}';
    document.head.appendChild(st);
  }
})();

// ── Retención [e.leo]: instalar como app + barra de suscripción al newsletter (y canal de WhatsApp si existe) ──
(function () {
  try { if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(function () { }); } catch (e) { }
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };
  if (document.getElementById('nlForm') || ls.get('eem_nl') || !/\/(notas|artistas)\//.test(location.pathname)) return;
  var API = 'https://eeem-newsletter.enelensayomedia.workers.dev';
  var barra = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function abrir(wa) {
    if (barra) return;
    barra = document.createElement('div'); barra.id = 'mx-nl';
    barra.innerHTML = '<button type="button" class="x" aria-label="Cerrar">×</button><b>📰 El Periódico, gratis en tu correo</b><span>Lo mejor de música y cultura de México, de lunes a viernes.</span>' +
      '<form novalidate><input type="email" name="email" placeholder="tu@correo.com" aria-label="Correo" required><button type="submit">Suscribirme</button>' +
      '<label><input type="checkbox" name="acepto"> Acepto el <a href="/privacy.html" target="_blank">aviso de privacidad</a></label></form><i class="msg"></i>' +
      (wa ? '<a class="wa" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 Únete al canal de WhatsApp</a>' : '');
    document.body.appendChild(barra);
    setTimeout(function () { barra.classList.add('on'); }, 60);
    barra.querySelector('.x').onclick = function () { ls.set('eem_nl', 'x'); barra.classList.remove('on'); };
    var f = barra.querySelector('form'), m = barra.querySelector('.msg');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = f.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e)) { m.textContent = 'Escribe un correo válido.'; return; }
      if (!f.acepto.checked) { m.textContent = 'Marca que aceptas el aviso de privacidad.'; return; }
      f.querySelector('button').disabled = true; m.textContent = 'Enviando…';
      fetch(API + '/suscribir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, acepto: true, web: '' }) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (j) {
          if (j.ok) { ls.set('eem_nl', 'ok'); barra.innerHTML = '<b>✅ ¡Listo!</b><span>Recibirás El Periódico en tu correo. Revisa spam la primera vez.</span>'; setTimeout(function () { barra.classList.remove('on'); }, 5000); }
          else { f.querySelector('button').disabled = false; m.textContent = 'No se pudo. Inténtalo de nuevo.'; }
        }).catch(function () { f.querySelector('button').disabled = false; m.textContent = 'Sin conexión. Inténtalo de nuevo.'; });
    });
  }
  function disparar() {
    window.removeEventListener('scroll', al);
    fetch('/data/redes.json?_=' + Date.now()).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (j) { abrir((j || {}).whatsapp || ''); });
  }
  function al() { var h = document.documentElement; if ((h.scrollTop + innerHeight) / Math.max(h.scrollHeight, 1) > 0.45) disparar(); }
  window.addEventListener('scroll', al, { passive: true });
})();
