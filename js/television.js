// Sección Televisión: data/television.json (Top 20 de IMDb, populares, radar) y notas propias (categoría Televisión)
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var fechaLarga = function (iso) { var d = new Date((iso || '') + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var tarjeta = function (s, i, radar) {
    var esc_ = s.escala || 'IMDb';
    return '<a class="tv-card tv-c' + (i % 6) + '" href="' + esc(s.url) + '" target="_blank" rel="noopener nofollow">' +
      '<span class="tv-pos">' + (radar ? '👀' : '#' + s.pos) + '</span>' +
      '<div class="tv-info"><h3>' + esc(s.titulo) + '</h3><span class="tv-meta">' + esc(s.tipo) + ' · ' + esc(s.anio) + '</span></div>' +
      '<div class="tv-nota"><b>★ ' + esc(s.imdb) + '</b><small>' + esc(esc_) + ' · ' + esc(s.votos) + (esc_ === 'IMDb' ? ' votos' : ' votos') + '</small></div></a>';
  };
  get('data/television.json').then(function (d) {
    document.getElementById('tvPopulares').innerHTML = (d.populares || []).map(function (s, i) { return tarjeta(s, i); }).join('') || '<p class="sx-vacio">Sin datos por ahora.</p>';
    document.getElementById('tvPopFuente').textContent = (d.populares_fuente || '') + (d.populares_leido ? ' · lista del ' + fechaLarga(d.populares_leido) : '');
    var r = document.getElementById('tvRadar');
    if (r) { r.innerHTML = (d.radar || []).map(function (s, i) { return tarjeta(s, i + 2, true); }).join(''); if (!(d.radar || []).length) { r.previousElementSibling.remove(); r.remove(); } }
    document.getElementById('tvCalificadas').innerHTML = (d.calificadas || []).map(function (s, i) { return tarjeta(s, i); }).join('') || '<p class="sx-vacio">Sin datos por ahora.</p>';
    document.getElementById('tvCalFuente').textContent = 'IMDb · lista del ' + fechaLarga(d.calificadas_leido) + ' (series y miniseries, según la calificación de los usuarios).';
  }).catch(function () { });

  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('tvNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Televisión'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: estrenos, renovaciones, finales de temporada y lo más visto.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Televisión</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
