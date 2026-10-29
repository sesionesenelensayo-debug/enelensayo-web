// Notas exclusivas: las últimas de cada categoría (Esports, Agenda woke, Chisme internacional, Historias de terror)
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var cats = [['sxExEsports', 'Esports'], ['sxExWoke', 'Agenda woke'], ['sxExChisme', 'Chisme internacional'], ['sxExTerror', 'Historias de terror']];
  fetch('data/articles.json?_=' + Date.now()).then(function (r) { return r.json(); }).then(function (arts) {
    cats.forEach(function (c) {
      var el = document.getElementById(c[0]); if (!el) return;
      var l = arts.filter(function (a) { return (a.categoria || '') === c[1]; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 3);
      if (!l.length) return;
      el.innerHTML = l.map(function (a) {
        return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') +
          '</div><div class="cuerpo"><span class="sx-tag">' + esc(c[1]) + '</span><h3>' + esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
      }).join('');
    });
  }).catch(function () { });
})();
