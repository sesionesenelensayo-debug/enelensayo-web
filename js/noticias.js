// Portal de noticias: bloques por sección (solo noticias ACTUALES, sin archivo; música primero) y gráficas de los artistas más escuchados
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  var num = function (n) { return Number(n || 0).toLocaleString('es-MX'); };
  var BLOQUES = {
    blkMusica: ['Música', 'Escena local', 'Internacional', 'Conciertos', 'Discos de la semana'],
    blkChisme: ['Chisme', 'Chisme internacional', 'Agenda woke'],
    blkCine: ['Cine'],
    blkCultura: ['Cultura', 'Biografía', 'In memoriam', 'Efeméride', 'Entrevista'],
    blkJuegos: ['Videojuegos', 'Esports']
  };
  function hace(f) {
    var h = (Date.now() - new Date(f).getTime()) / 36e5;
    return h < 1 ? 'hace minutos' : h < 24 ? 'hace ' + Math.round(h) + ' h' : h < 48 ? 'ayer' : new Date(f).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }
  function tarjeta(a) {
    var foto = a.imagen_url ? '<img src="' + esc(a.imagen_url) + '" alt="" loading="lazy">' : '🎵';
    return '<a class="sx-card" href="' + esc(a.url) + '" target="_blank" rel="noopener"><div class="foto">' + foto + '</div><div class="cuerpo"><span class="sx-tag">' + esc(a.categoria) +
      '</span><h3>' + esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + hace(a.fecha) + '</span></span></div></a>';
  }
  if (document.querySelector('[data-bloque]')) get('data/articles.json').then(function (arts) {
    var vivas = arts.filter(function (a) { return !a.archivo; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    Object.keys(BLOQUES).forEach(function (id) {
      var el = $(id); if (!el) return;
      var l = vivas.filter(function (a) { return BLOQUES[id].indexOf(a.categoria) >= 0; }).slice(0, 4);
      el.innerHTML = l.length ? l.map(tarjeta).join('') : '<p class="sx-vacio">Preparando las noticias de hoy…</p>';
    });
  }).catch(function () { });
  function barras(el, lista, unidad, color) {
    if (!el || !lista || !lista.length) return;
    var max = Math.max.apply(null, lista.map(function (x) { return x.valor; }));
    el.innerHTML = lista.slice(0, 10).map(function (x) {
      return '<div class="gr-fila"><span class="gr-n">' + x.n + '</span><a class="gr-nom" href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.nombre) +
        '</a><div class="gr-barra"><i style="width:' + Math.max(4, Math.round(100 * x.valor / max)) + '%;background:' + color + '"></i></div><span class="gr-v">' + num(x.valor) + '</span></div>';
    }).join('') + '<p class="gr-u">' + unidad + '</p>';
  }
  if ($('grafMx') || $('grafMundo')) get('data/spotify.json').then(function (sp) {
    barras($('grafMx'), sp.mexico, 'Reproducciones del día en México (suma de sus canciones en el top 200)', 'linear-gradient(90deg,#ffeb3b,#ff6b3d)');
    barras($('grafMundo'), sp.mundo, 'Oyentes mensuales en el mundo', 'linear-gradient(90deg,#00d6f0,#673ab7)');
    var f = $('grafFuente'); if (f) f.textContent = (sp.fuente || 'Spotify vía kworb.net') + ' · actualizado ' + (sp.actualizado || '');
  }).catch(function () { });
})();
