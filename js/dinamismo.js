// Aparición suave de tarjetas al hacer scroll (también las que se cargan después). Sin esto la página se ve igual.
(function () {
  if (!('IntersectionObserver' in window) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  var SEL = '.sx-card,.otra,.caja,.section-header,.pod-card,.featured-card';
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vi'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  function marca(raiz) {
    (raiz.matches && raiz.matches(SEL) ? [raiz] : []).concat([].slice.call(raiz.querySelectorAll ? raiz.querySelectorAll(SEL) : [])).forEach(function (el) {
      if (el.classList.contains('rv')) return;
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) return;          // lo que ya se ve al cargar no se anima
      el.classList.add('rv'); io.observe(el);
    });
  }
  marca(document.body);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) marca(n); }); });
  }).observe(document.body, { childList: true, subtree: true });
})();
