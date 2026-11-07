// Sección Doblaje: data/doblaje.json (caso destacado, línea de tiempo y casos de star talents) y notas propias (categoría Doblaje). Sin enlaces a otros medios.
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var ETQ = { 'polémica': ['🔥 Polémica', 'dbl-pol'], 'celebrado': ['🏆 Celebrado', 'dbl-cel'], 'anunciado': ['📣 Anunciado', 'dbl-anu'] };

  get('data/doblaje.json').then(function (d) {
    var h = d.destacado || {};
    document.getElementById('dblHero').innerHTML =
      '<span class="dbl-badge">🔥 La polémica del momento</span><h3>' + esc(h.pelicula) + '</h3>' +
      '<p class="dbl-sub">' + esc(h.estudio) + ' · estreno ' + esc(h.estreno) + '</p>' +
      '<div class="dbl-talents">' + (h.star_talents || []).map(function (s) {
        return '<div class="dbl-talent"><b>' + esc(s.nombre) + '</b><span>' + esc(s.papel) + '</span><small>' + esc(s.dato) + '</small></div>';
      }).join('') + '</div>' +
      '<ul class="dbl-datos">' + (h.datos || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    document.getElementById('dblTiempo').innerHTML = (h.linea_tiempo || []).map(function (t) {
      return '<div class="dbl-t"><b>' + esc(t.fecha) + '</b><span>' + esc(t.hecho) + '</span></div>';
    }).join('');
    var casos = d.casos || [], filtros = [['todos', 'Todos'], ['polémica', 'Polémicas'], ['celebrado', 'Los que sí funcionaron'], ['anunciado', 'Anunciados']];
    var pinta = function (f) {
      var fe = document.getElementById('dblFiltros');
      fe.innerHTML = filtros.map(function (x) { return '<button type="button" class="lu-chip' + (x[0] === f ? ' on' : '') + '" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('');
      Array.prototype.forEach.call(fe.querySelectorAll('button'), function (b) { b.onclick = function () { pinta(b.getAttribute('data-v')); }; });
      var l = casos.filter(function (c) { return f === 'todos' || c.estado === f; });
      document.getElementById('dblCasos').innerHTML = l.map(function (c) {
        var e = ETQ[c.estado] || ETQ['polémica'];
        return '<div class="dbl-caso"><span class="dbl-et ' + e[1] + '">' + e[0] + '</span><h4>' + esc(c.pelicula) + ' <small>' + esc(c.anio || '') + '</small></h4>' +
          '<p class="dbl-voz">🎙️ ' + (c.star_talents || []).map(esc).join(' · ') + '</p><p>' + esc(c.resumen) + '</p></div>';
      }).join('') || '<p class="sx-vacio">Sin casos en esta categoría por ahora.</p>';
    };
    pinta('todos');
  }).catch(function () { });

  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('dblNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Doblaje'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 18);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: toda la polémica de los star talents, nota por nota.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Doblaje</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
