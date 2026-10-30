// Top 10 semanal (México e Internacional), mini-tarjeta de la portada y edición del Periódico: leen data/top10.json y data/periodico.json
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  function mov(m) { return m === 'NEW' ? '<em class="t10-n">NUEVO</em>' : /^\+/.test(m) ? '<em class="t10-s">▲ ' + esc(m.slice(1)) + '</em>' : /^-/.test(m) ? '<em class="t10-b">▼ ' + esc(m.slice(1)) + '</em>' : '<em>＝</em>'; }
  function lista(el, arr) {
    if (!el) return;
    el.innerHTML = arr.map(function (c) {
      return '<li><span class="t10-pos">' + c.pos + '</span><div><b>' + esc(c.cancion) + '</b><small>' + esc(c.artista) + (c.extra ? ' · con ' + esc(c.extra) : '') + '</small>' +
        '<small>' + (c.mov === 'NEW' ? 'Debuta esta semana' : c.semanas + ' sem. en lista · pico nº ' + c.pico) + ' · ' + esc(c.streams) + '</small></div>' + mov(c.mov) + '</li>';
    }).join('');
  }
  if ($('t10Mx') || $('t10Mini')) get('data/top10.json').then(function (d) {
    lista($('t10Mx'), d.mx || []); lista($('t10Int'), d.int || []);
    var f = $('t10Fuente'); if (f) f.innerHTML = esc(d.rango || '') + ' · Datos: Spotify Charts, contrastados con iTunes. ' + (d.url_nota ? '<a href="' + esc(d.url_nota) + '">Ver la nota completa →</a>' : '');
    var v = $('t10Video'); if (v && d.video) v.innerHTML = '<a class="t10-ver" href="' + esc(d.video) + '" target="_blank" rel="noopener">▶ Ver el short de la cuenta regresiva</a>';
    var m = $('t10Mini'); if (m && d.mx && d.int) m.innerHTML = '<div class="t10-mini-c"><span>🇲🇽 Nº 1 México</span><b>' + esc(d.mx[0].cancion) + '</b><small>' + esc(d.mx[0].artista) + '</small></div>' +
      '<div class="t10-mini-c"><span>🌎 Nº 1 Internacional</span><b>' + esc(d.int[0].cancion) + '</b><small>' + esc(d.int[0].artista) + '</small></div>';
  }).catch(function () { ['t10Mx', 't10Int'].forEach(function (i) { var e = $(i); if (e) e.innerHTML = '<li class="sx-vacio">Pronto: la primera cuenta regresiva.</li>'; }); });
  var pc = $('perCaja'), pm = $('perMini');
  if (pc || pm) get('data/periodico.json').then(function (d) {
    if (!d || !d.pdf) throw 0;
    var html = '<a class="per-port" href="' + esc(d.pdf) + '" target="_blank" rel="noopener">' + (d.portada ? '<img src="' + esc(d.portada) + '" alt="Portada del periódico" loading="lazy">' : '') + '</a>' +
      '<div class="per-info"><h3>Edición nº ' + esc(d.numero) + ' · ' + esc(d.fecha_larga || d.fecha) + '</h3><p>' + esc(d.paginas) + ' páginas para leer en el celular.</p><a class="sx-mas per-bt" href="' + esc(d.pdf) + '" target="_blank" rel="noopener">⬇ Descargar gratis (PDF)</a></div>';
    if (pc) pc.innerHTML = html; if (pm) pm.innerHTML = html;
  }).catch(function () { });
})();
