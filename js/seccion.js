// [.leon 2026-11-05] Landing genérica de sección: notas por categoría + shorts y longs de YouTube (incrustados) de esa sección.
(function () {
  var cont = document.getElementById('secLanding'); if (!cont) return;
  var cats = (cont.dataset.cats || '').split('|').filter(Boolean), maxN = parseInt(cont.dataset.max || '24', 10);
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('secNotas');
    var l = arts.filter(function (a) { return cats.indexOf(a.categoria || '') >= 0 && !a.archivo; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, maxN);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: notas de esta sección.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">' +
        esc(a.categoria) + '</span><h3>' + esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
  get('data/videos_seccion.json').then(function (v) {
    var sh = [], lg = [];
    cats.forEach(function (c) { if (v[c]) { sh = sh.concat(v[c].shorts || []); lg = lg.concat(v[c].longs || []); } });
    var pinta = function (id, lista, clase, cab) {
      var box = document.getElementById(id), tit = document.getElementById(id + 'T'); if (!box) return;
      if (!lista.length) { if (tit) tit.style.display = 'none'; box.style.display = 'none'; return; }
      lista.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
      box.innerHTML = lista.slice(0, 8).map(function (x) {
        return '<figure class="sec-vid ' + clase + '"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + esc(x.id) + '?rel=0" title="' + esc(x.titulo) + '" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
          '<figcaption>' + (x.nota ? '<a href="' + esc(x.nota) + '">' + esc(x.titulo) + '</a>' : esc(x.titulo)) + '</figcaption></figure>';
      }).join('');
    };
    pinta('secLongs', lg, 'largo'); pinta('secShorts', sh, 'corto');
  }).catch(function () { });
})();
