// Efectos suaves: barra de progreso de lectura, barra de navegación que se compacta y aparición al desplazarse (respeta «reducir movimiento»)
(function () {
  var barra = document.createElement('div'); barra.id = 'progreso'; document.body.appendChild(barra);
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    barra.style.width = (max > 0 ? Math.min(100, 100 * h.scrollTop / max) : 0) + '%';
    var nb = document.querySelector('.navbar'); if (nb) nb.classList.toggle('scrolled', h.scrollTop > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-header,.sx-grid,.gr-cols,.t10-cols,.per-caja,.secciones-grid,.cta-band-inner,.t10-mini').forEach(function (el, i) { el.classList.add('rev'); el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); });
})();
