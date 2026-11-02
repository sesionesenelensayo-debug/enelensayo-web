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

  // ── Recomendaciones de Oliver Ken: votos (contadores abacus, un voto por persona y serie) + noticias y seguimiento ──
  var NS = 'https://abacus.jasoncameron.dev', ESP = 'enelensayo-mx2';
  var guardado = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { } return null; };
  var cuenta = function (k) { return fetch(NS + '/get/' + ESP + '/' + k).then(function (r) { return r.json(); }).then(function (j) { return +j.value || 0; }).catch(function () { return 0; }); };
  var pinta = function (card, si, no) {
    var t = si + no, p = t ? Math.round(100 * si / t) : 0;
    card.querySelector('.tv-si b').textContent = si; card.querySelector('.tv-no b').textContent = no;
    card.querySelector('.tv-barra i').style.width = (t ? p : 0) + '%';
    card.querySelector('.tv-pct').textContent = t ? p + '% aprueba · ' + t + ' voto' + (t === 1 ? '' : 's') : 'Sé el primero en votar';
  };
  var votos = function (card, slug) {
    var si = 0, no = 0, previo = guardado('tvv-' + slug);
    cuenta('tv-' + slug + '-si').then(function (a) { si = a; return cuenta('tv-' + slug + '-no'); }).then(function (b) { no = b; pinta(card, si, no); });
    if (previo) { card.classList.add('votado', previo === 'si' ? 'v-si' : 'v-no'); }
    Array.prototype.forEach.call(card.querySelectorAll('.tv-voto'), function (b) {
      b.onclick = function () {
        if (guardado('tvv-' + slug)) return;
        var v = b.getAttribute('data-v'); guardado('tvv-' + slug, v);
        card.classList.add('votado', v === 'si' ? 'v-si' : 'v-no');
        if (v === 'si') si++; else no++; pinta(card, si, no);
        fetch(NS + '/hit/' + ESP + '/tv-' + slug + '-' + v).catch(function () { });
      };
    });
  };
  Promise.all([get('data/television.json'), get('data/articles.json').catch(function () { return []; })]).then(function (r) {
    var rec = (r[0].recomendadas || []), arts = r[1] || [], el = document.getElementById('tvReco'); if (!el) return;
    if (!rec.length) { el.parentNode.removeChild(el.previousElementSibling); el.remove(); return; }
    el.innerHTML = rec.map(function (s, i) {
      var re = null; try { re = new RegExp(s.alias, 'i'); } catch (e) { }
      var propias = re ? arts.filter(function (a) { return re.test((a.titulo || '') + ' ' + (a.artista || '')); }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 2) : [];
      var li = propias.map(function (a) { return '<li><a href="' + esc(a.url) + '"><b>Nuestra nota</b> · ' + esc(a.titulo) + ' <small>' + fecha(a.fecha) + '</small></a></li>'; }).join('') +
        (propias.length ? '' : (s.noticias || []).map(function (n) { return '<li><span class="tv-seg">' + esc(n.titulo) + ' <small>' + fecha(n.fecha) + '</small></span></li>'; }).join(''));
      return '<article class="tv-rc tv-c' + (i % 6) + '" data-slug="' + esc(s.slug) + '"><div class="tv-rc-cab"><span class="tv-pos">#' + (i + 1) + '</span><div><h3>' + esc(s.titulo) + '</h3><span class="tv-meta">' + esc(s.tipo) + ' · recomendada por Oliver Ken</span></div></div>' +
        '<div class="tv-votos"><button type="button" class="tv-voto tv-si" data-v="si">👍 Apruebo <b>0</b></button><button type="button" class="tv-voto tv-no" data-v="no">👎 No apruebo <b>0</b></button></div>' +
        '<div class="tv-barra"><i></i></div><div class="tv-pct">Cargando votos…</div>' +
        '<details class="tv-seg"' + (li ? '' : ' ') + '><summary>Noticias y seguimiento' + (li ? '' : ' · sin novedades esta semana') + '</summary>' + (li ? '<ul>' + li + '</ul>' : '<p>Seguimos al pendiente: apenas haya estreno, renovación o fecha, aparece aquí.</p>') + '</details></article>';
    }).join('');
    var obs = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { obs.unobserve(x.target); votos(x.target, x.target.getAttribute('data-slug')); } }); }, { rootMargin: '200px' }) : null;
    Array.prototype.forEach.call(el.querySelectorAll('.tv-rc'), function (c) { if (obs) obs.observe(c); else votos(c, c.getAttribute('data-slug')); });
  }).catch(function () { });
})();
