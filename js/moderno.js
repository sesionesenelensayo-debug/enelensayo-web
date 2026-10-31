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
