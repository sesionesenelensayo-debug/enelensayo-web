// Publicidad del portal (método de OKpolítico): espacios «cabecera» y «nota»; vendido → anuncio rotulado «Publicidad»;
// libre → invitación a anunciarse. Más un contador de visitas anónimo (sin datos personales) para medir la audiencia.
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var A = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx/';
  function hit(k) { try { fetch(A + k, { mode: 'no-cors', keepalive: true }); } catch (e) { } }
  try {
    if (/[?&]yo=1/.test(location.search)) localStorage.eem_yo = '1';
    if (/[?&]yo=0/.test(location.search)) localStorage.removeItem('eem_yo');
    if (!localStorage.eem_yo) {
      var d = new Date(), k = 'v-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
      var pag = (location.pathname.split('/').pop().replace('.html', '') || 'inicio').slice(0, 24).replace(/[^a-z0-9-]/gi, '');
      hit('v-total'); hit(k); hit('p-' + pag);
    }
  } catch (e) { }
  var slots = document.querySelectorAll('[data-slot]'); if (!slots.length) return;
  fetch('/data/anuncios.json?_=' + Date.now()).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (ads) {
    slots.forEach(function (el) {
      var pos = el.dataset.slot, a = ads[pos];
      if (a && (a.html || a.img)) {
        el.className = 'ad';
        el.innerHTML = '<span>Publicidad</span>' + (a.html || '<a href="' + esc(a.url) + '" rel="sponsored noopener" target="_blank" data-ad="' + esc(pos) + '"><img src="' + esc(a.img) + '" alt="' + esc(a.marca || '') + '" loading="lazy"></a>');
      } else {
        el.className = 'ad libre';
        el.innerHTML = '<a href="/anunciate.html" data-ad="libre-' + esc(pos) + '">Anúnciate aquí desde $49 MXN · tu negocio frente a lectores de música de México →</a>';
      }
    });
  });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-ad]'); if (a) hit('ad-' + a.dataset.ad.replace(/[^a-z0-9-]/gi, '').slice(0, 30)); }, true);
})();
