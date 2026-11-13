// Sección Reality: seguimiento diario (data/reality.json), perfiles/ganadores/polémicas (data/reality_base.json) y notas propias — [.leon 2026-11-13]
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: (new Date().getFullYear() !== d.getFullYear() ? 'numeric' : undefined) }); };
  var grid = document.getElementById('reGrid'); if (!grid) return;
  var lista = function (arr, max) {
    return '<ul>' + arr.slice(0, max || 5).map(function (t) {
      return '<li><a href="' + esc(t.link) + '" target="_blank" rel="noopener nofollow">' + esc(t.titulo) + '</a><small>' + esc(t.medio) + (t.fecha ? ' · ' + fecha(t.fecha) : '') + '</small></li>';
    }).join('') + '</ul>';
  };
  var live = get('data/reality.json').catch(function () { return {}; });
  var base = get('data/reality_base.json').catch(function () { return {}; });

  live.then(function (d) {
    var ps = (d.programas || []).filter(function (p) { return (p.titulares || []).length; });
    grid.innerHTML = ps.length ? ps.map(function (p) {
      return '<article class="re-card"><h3>' + esc(p.nombre) + '</h3><span class="re-canal">' + esc(p.canal) + '</span>' + lista(p.titulares, 5) + '</article>';
    }).join('') : '<p class="sx-vacio">Sin novedades por ahora.</p>';
    var av = document.getElementById('reAviso');
    if (av && d.actualizado) av.textContent += ' Actualizado ' + d.actualizado + '.';
    var pv = document.getElementById('rePolemVivas');
    if (pv) pv.innerHTML = (d.polemicas || []).length ? '<div class="re-card re-hot"><span class="re-canal">🔥 Lo más comentado · últimos 3 días</span>' + lista(d.polemicas, 8) + '</div>' : '';
  });

  Promise.all([live, base]).then(function (r) {
    var d = r[0], b = r[1];
    var arch = document.getElementById('rePolemArchivo');
    if (arch) arch.innerHTML = (b.polemicas || []).map(function (x) {
      return '<li><time>' + esc(fecha(x.fecha)) + '</time><b>' + esc(x.titulo) + '</b><p>' + esc(x.texto) + '</p></li>';
    }).join('');
    var pg = document.getElementById('rePerfilesGrid');
    if (pg) pg.innerHTML = (b.perfiles || []).map(function (p) {
      var ult = (d.personas || {})[p.slug] || [];
      return '<details class="re-perfil" id="p-' + esc(p.slug) + '"><summary><span class="re-ini">' + esc(p.nombre.split(' ').slice(0, 2).map(function (w) { return w.charAt(0); }).join('')) + '</span>' +
        '<span class="re-pn"><b>' + esc(p.nombre) + '</b><small>' + esc(p.rol) + '</small></span></summary><div class="re-pc">' +
        '<p class="re-chips">' + (p.programas || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</p>' +
        '<p>' + esc(p.bio) + '</p>' +
        ((p.hitos || []).length ? '<h5>Lo que ha logrado</h5><ul class="re-lista">' + p.hitos.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
        ((p.polemicas || []).length ? '<h5>Polémicas</h5><ul class="re-lista">' + p.polemicas.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
        (ult.length ? '<h5>Lo último</h5>' + lista(ult, 4) : '') + '</div></details>';
    }).join('');
    var pr = document.getElementById('reProgs');
    if (pr) pr.innerHTML = (b.programas || []).map(function (p) {
      return '<article class="re-prog"><h4>' + esc(p.nombre) + '</h4><span class="re-canal">' + esc(p.canal) + ' · premio: ' + esc(p.premio) + '</span><p>' + esc(p.resumen) + '</p>' +
        '<ol class="re-gan">' + (p.ganadores || []).map(function (g) {
          return '<li><span class="re-t">' + esc(g.temporada) + ' · ' + esc(g.anio) + '</span><b>' + esc(g.ganador) + '</b>' + (g.dato ? '<small>' + esc(g.dato) + '</small>' : '') + '</li>';
        }).join('') + '</ol></article>';
    }).join('');
    if (location.hash && document.querySelector(location.hash)) { var t = document.querySelector(location.hash); if (t.tagName === 'DETAILS') t.open = true; }
  });

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
