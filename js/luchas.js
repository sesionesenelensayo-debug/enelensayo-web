// Sección Luchas: data/luchas.json (próximas funciones + campeones vigentes) y notas propias (categoría Luchas)
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var foto = function (o) {
    if (!o.img) return '';
    return '<figure class="lu-foto"><img loading="lazy" src="' + esc(o.img) + '" alt="' + esc(o.campeon || o.nombre || '') + '" onerror="this.parentNode.remove()">' +
      '<figcaption>' + (o.credito_url ? '<a href="' + esc(o.credito_url) + '" target="_blank" rel="noopener nofollow">' + esc(o.credito) + '</a>' : esc(o.credito)) + '</figcaption></figure>';
  };
  var chips = function (el, items, activo, fn) {
    el.innerHTML = items.map(function (x) { return '<button type="button" class="lu-chip' + (x === activo ? ' on' : '') + '" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('button'), function (b) { b.onclick = function () { fn(b.getAttribute('data-v')); }; });
  };

  get('data/luchas.json').then(function (d) {
    var evs = d.eventos || [], promos = ['Todas'].concat(Array.from(new Set(evs.map(function (e) { return e.promocion; }))));
    var pintaEv = function (p) {
      var l = evs.filter(function (e) { return p === 'Todas' || e.promocion === p; });
      chips(document.getElementById('luFiltros'), promos, p, pintaEv);
      document.getElementById('luEventos').innerHTML = l.length ? l.map(function (e) {
        var dt = new Date(e.fecha + 'T12:00:00');
        var precio = e.precio ? 'Boletos ' + esc(e.precio) : 'Precio por confirmar en taquilla o boletera oficial';
        var camps = (e.campeonatos || []).map(function (c) { return '<span class="lu-camp">🏆 ' + esc(c) + '</span>'; }).join('');
        return '<div class="sx-card sx-ev lu-conimg">' + foto(e) + '<div class="sx-fecha"><b>' + dt.getDate() + '</b><small>' + dt.toLocaleDateString('es-MX', { month: 'short' }) + '</small></div>' +
          '<div><h3>' + esc(e.nombre) + '</h3><span class="sx-meta"><span><b>' + esc(e.promocion) + '</b> · ' + esc([e.lugar, e.ciudad].filter(Boolean).join(', ') || 'Sede por confirmar') + '</span><span>' + precio + '</span></span>' +
          (camps ? '<div class="lu-camps">' + camps + '</div>' : '') +
          (e.fuente ? '<a class="lu-fuente" href="' + esc(e.fuente) + '" target="_blank" rel="noopener nofollow">Fuente ↗</a>' : '') + '</div></div>';
      }).join('') : '<p class="sx-vacio">Sin funciones confirmadas para esta empresa por ahora.</p>';
    };
    pintaEv('Todas');
    document.getElementById('luAviso').textContent = 'Programación sujeta a cambios. Actualizado ' + (d.actualizado || '') + '. Solo se publica el precio cuando una página oficial o de boletos lo muestra; si no, confirma en taquilla.';
    var c = d.campeones || {}, ps = Object.keys(c);
    var pintaC = function (p) {
      chips(document.getElementById('luPromos'), ps, p, pintaC);
      document.getElementById('luCampeones').innerHTML = (c[p] || []).map(function (x) {
        return '<div class="sx-card sx-ev lu-conimg">' + foto(x) + '<div class="sx-fecha" style="background:#ffd23f;color:#111"><b>🏆</b><small>' + esc(p) + '</small></div><div><h3>' + esc(x.campeon) + '</h3><span class="sx-meta"><span>' + esc(x.titulo) + '</span></span></div></div>';
      }).join('') || '<p class="sx-vacio">Sin datos por ahora.</p>';
    };
    if (ps.length) pintaC(ps[0]);
  }).catch(function () { });

  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('luNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Luchas'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: resultados, campeonatos y regresos de la lucha libre.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Luchas</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
