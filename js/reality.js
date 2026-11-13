// Sección Reality: SOLO contenido propio — notas (articles.json), perfiles/ganadores/polémicas (reality_base.json) — [.leon 2026-11-13]
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: (new Date().getFullYear() !== d.getFullYear() ? 'numeric' : undefined) }); };
  var el = document.getElementById('reNotas'); if (!el) return;
  var tarjeta = function (a) {
    return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Reality</span><h3>' +
      esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
  };
  var norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var notas = get('data/articles.json').catch(function () { return []; });
  var base = get('data/reality_base.json').catch(function () { return {}; });

  Promise.all([notas, base]).then(function (r) {
    var arts = r[0].sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }), b = r[1];
    var rea = arts.filter(function (a) { return (a.categoria || '') === 'Reality'; });
    el.innerHTML = rea.length ? rea.slice(0, 12).map(tarjeta).join('') : '<p class="sx-vacio">Pronto: nuestras notas del día sobre las casas y las granjas.</p>';

    var arch = document.getElementById('rePolemArchivo');
    if (arch) arch.innerHTML = (b.polemicas || []).map(function (x) {
      return '<li><time>' + esc(fecha(x.fecha)) + '</time><b>' + esc(x.titulo) + '</b><p>' + esc(x.texto) + '</p></li>';
    }).join('');

    var pg = document.getElementById('rePerfilesGrid');
    if (pg) {
      pg.innerHTML = (b.perfiles || []).map(function (p) {
        var rx = new RegExp(p.alias || p.nombre, 'i');
        var propias = arts.filter(function (a) { return rx.test(norm(a.titulo) + ' ' + norm(a.artista)) || rx.test((a.titulo || '') + ' ' + (a.artista || '')); }).slice(0, 4);
        var ini = esc(p.nombre.split(' ').slice(0, 2).map(function (w) { return w.charAt(0); }).join(''));
        var av = p.foto ? '<span class="re-av"><img loading="lazy" src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '" onerror="this.parentNode.classList.add(\'sinfoto\');this.remove()"></span>' : '<span class="re-av sinfoto" data-ini="' + ini + '"></span>';
        return '<details class="re-perfil" id="p-' + esc(p.slug) + '"' + (p.instagram ? ' data-ig="' + esc(p.instagram) + '"' : '') + '><summary>' + av.replace('<span class="re-av sinfoto" data-ini="' + ini + '"></span>', '<span class="re-av sinfoto">' + ini + '</span>') +
          '<span class="re-pn"><b>' + esc(p.nombre) + '</b><small>' + esc(p.rol) + '</small></span></summary><div class="re-pc">' +
          '<p class="re-chips">' + (p.programas || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</p>' +
          (p.foto ? '<figure class="re-foto"><img loading="lazy" src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '"><figcaption>' + esc(p.foto_credito || '') + '</figcaption></figure>' : '') +
          '<p>' + esc(p.bio) + '</p>' +
          ((p.hitos || []).length ? '<h5>Lo que ha logrado</h5><ul class="re-lista">' + p.hitos.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
          ((p.polemicas || []).length ? '<h5>Polémicas</h5><ul class="re-lista">' + p.polemicas.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
          (propias.length ? '<h5>Nuestras notas</h5><ul class="re-lista re-notas-p">' + propias.map(function (a) { return '<li><a href="' + esc(a.url) + '">' + esc(a.titulo) + '</a><small>' + fecha(a.fecha) + '</small></li>'; }).join('') + '</ul>' : '') +
          (p.instagram ? '<h5>Su Instagram</h5><div class="re-ig" data-u="' + esc(p.instagram) + '"></div>' : '') + '</div></details>';
      }).join('');
      // El embed de Instagram se carga solo al abrir la tarjeta (no pesa en la carga de la página)
      Array.prototype.forEach.call(pg.querySelectorAll('details.re-perfil'), function (d) {
        d.addEventListener('toggle', function () {
          var c = d.querySelector('.re-ig'); if (!d.open || !c || c.firstChild) return;
          c.innerHTML = '<iframe class="re-igf" src="https://www.instagram.com/' + encodeURIComponent(c.getAttribute('data-u')) + '/embed/" loading="lazy" scrolling="no" allowtransparency="true" frameborder="0" title="Instagram de ' + esc(d.querySelector('b').textContent) + '"></iframe>';
        });
      });
      if (location.hash) { var t = document.querySelector(location.hash); if (t && t.tagName === 'DETAILS') { t.open = true; t.scrollIntoView(); } }
    }

    var pr = document.getElementById('reProgs');
    if (pr) pr.innerHTML = (b.programas || []).map(function (p) {
      return '<article class="re-prog"><h4>' + esc(p.nombre) + '</h4><span class="re-canal">' + esc(p.canal) + ' · premio: ' + esc(p.premio) + '</span><p>' + esc(p.resumen) + '</p>' +
        '<ol class="re-gan">' + (p.ganadores || []).map(function (g) {
          return '<li><span class="re-t">' + esc(g.temporada) + ' · ' + esc(g.anio) + '</span><b>' + esc(g.ganador) + '</b>' + (g.dato ? '<small>' + esc(g.dato) + '</small>' : '') + '</li>';
        }).join('') + '</ol></article>';
    }).join('');
  });
})();
