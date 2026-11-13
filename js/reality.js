// Sección Reality: data/reality.json (seguimiento diario por programa) y notas propias (categoría Reality) — [.leon 2026-11-13]
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var grid = document.getElementById('reGrid'); if (!grid) return;
  get('data/reality.json').then(function (d) {
    var ps = (d.programas || []).filter(function (p) { return (p.titulares || []).length; });
    if (!ps.length) { grid.innerHTML = '<p class="sx-vacio">Sin novedades por ahora.</p>'; return; }
    grid.innerHTML = ps.map(function (p) {
      return '<article class="re-card"><h3>' + esc(p.nombre) + '</h3><span class="re-canal">' + esc(p.canal) + '</span><ul>' +
        p.titulares.slice(0, 5).map(function (t) {
          return '<li><a href="' + esc(t.link) + '" target="_blank" rel="noopener nofollow">' + esc(t.titulo) + '</a><small>' + esc(t.medio) + (t.fecha ? ' · ' + fecha(t.fecha) : '') + '</small></li>';
        }).join('') + '</ul></article>';
    }).join('');
    var av = document.getElementById('reAviso');
    if (av && d.actualizado) av.textContent += ' Actualizado ' + d.actualizado + '.';
  }).catch(function () { });
  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('reNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Reality'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: nuestras notas del día sobre las casas y las granjas.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Reality</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
