// Sección Videojuegos: data/videojuegos.json (peor calificados + estrenos) y notas propias (categoría Videojuegos)
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var color = function (n) { return n < 40 ? '#ff4d6d' : n < 60 ? '#ff9f1c' : '#ffd23f'; };

  get('data/videojuegos.json').then(function (d) {
    var p = document.getElementById('sxVjPeores');
    if (p && d.peores && d.peores.length) {
      p.innerHTML = d.peores.map(function (g, i) {
        return '<div class="sx-card sx-ev"><div class="sx-fecha" style="background:' + color(g.score) + ';color:#111"><b>' + g.score + '</b><small>Meta</small></div>' +
          '<div><h3>' + (i + 1) + '. ' + esc(g.titulo) + '</h3><span class="sx-meta"><span>' + esc(g.plataforma) + (g.genero ? ' · ' + esc(g.genero) : '') + ' · ' + g.resenas + ' reseñas</span></span></div></div>';
      }).join('');
    }
    var e = document.getElementById('sxVjEstrenos');
    if (e && d.estrenos && d.estrenos.length) {
      e.innerHTML = d.estrenos.map(function (g) {
        var dt = new Date(g.fecha + 'T12:00:00');
        return '<div class="sx-card sx-ev"><div class="sx-fecha"><b>' + dt.getDate() + '</b><small>' + dt.toLocaleDateString('es-MX', { month: 'short' }) + '</small></div>' +
          '<div><h3>' + esc(g.titulo) + '</h3><span class="sx-meta"><span>' + esc((g.plataformas || []).join(', ')) + (g.genero ? ' · ' + esc(g.genero) : '') + '</span></span></div></div>';
      }).join('');
    }
  }).catch(function () { });

  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('sxVjNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Videojuegos'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: las polémicas del mundo gamer, con datos.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Videojuegos</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
