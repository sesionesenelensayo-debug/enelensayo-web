// Pestañas nuevas del portal: carga data/secciones.json, data/conciertos.json y data/stats.json
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fechaCorta = function (f) { if (!f) return ''; var d = new Date(f.replace(' ', 'T')); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };

  function tarjetas(id, items, tag) {
    var el = document.getElementById(id); if (!el) return;
    if (!items || !items.length) { el.innerHTML = '<p class="sx-vacio">Actualizando… vuelve en unos minutos.</p>'; return; }
    el.innerHTML = items.map(function (i) {
      return '<a class="sx-card" href="' + esc(i.url) + '" target="_blank" rel="noopener nofollow">' + (tag ? '<span class="sx-tag">' + esc(tag) + '</span>' : '') +
        '<h3>' + esc(i.titulo) + '</h3><span class="sx-meta"><b>' + esc(i.fuente) + '</b><span>' + fechaCorta(i.fecha) + '</span></span></a>';
    }).join('');
  }

  function propios(id, items) {
    var el = document.getElementById(id); if (!el || !items || !items.length) return;
    el.innerHTML = items.map(function (v) {
      return '<a class="sx-card" href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener"><span class="sx-tag">Nuestro video</span><h3>' + esc(v.titulo) + '</h3><span class="sx-meta"><b>YouTube</b><span>' + fechaCorta(v.fecha) + '</span></span></a>';
    }).join('');
  }

  get('data/secciones.json').then(function (d) {
    tarjetas('sxMisterio', d.misterio, 'Misterio');
    tarjetas('sxDeporte', d.deporte, 'Música y deporte');
    propios('sxMisterioPropio', d.misterio_propio);
  }).catch(function () { });

  // Chisme PROPIO: solo notas de este sitio (categoría Chisme), con foto y enlace interno
  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('sxChisme'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Chisme'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Preparando las notas de hoy…</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Chisme</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fechaCorta(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });

  get('data/conciertos.json').then(function (c) {
    var ev = document.getElementById('sxEventos');
    if (ev) {
      if (c.eventos && c.eventos.length) {
        ev.innerHTML = c.eventos.slice(0, 24).map(function (e) {
          var d = new Date(e.fecha + 'T12:00:00');
          return '<div class="sx-card sx-ev"><div class="sx-fecha"><b>' + d.getDate() + '</b><small>' + d.toLocaleDateString('es-MX', { month: 'short' }) + '</small></div>' +
            '<div><h3>' + esc(e.nombre) + '</h3><span class="sx-meta"><span>' + esc(e.recinto) + ' · ' + esc(e.ciudad) + (e.hora ? ' · ' + esc(e.hora) : '') + '</span></span></div>' +
            '<a class="sx-btn" href="' + esc(e.url) + '" target="_blank" rel="noopener nofollow">Boletos</a></div>';
        }).join('');
      } else { ev.innerHTML = ''; }
    }
    var tm = document.getElementById('sxTm');
    if (tm && c.ticketmaster) {
      tm.innerHTML = '<a class="sx-chip" href="' + esc(c.ticketmaster.inicio) + '" target="_blank" rel="noopener nofollow"><b>Todos los conciertos en Ticketmaster</b></a>' +
        c.ticketmaster.recintos.map(function (r) { return '<a class="sx-chip" href="' + esc(r.url) + '" target="_blank" rel="noopener nofollow">' + esc(r.recinto) + '<small>' + esc(r.ciudad) + '</small></a>'; }).join('');
    }
    var fv = document.getElementById('sxFever');
    if (fv && c.fever) fv.innerHTML = c.fever.map(function (f) { return '<a class="sx-chip" href="' + esc(f.url) + '" target="_blank" rel="noopener nofollow">' + esc(f.nombre) + '</a>'; }).join('');
  }).catch(function () { });

  var ESC = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
  function hito(v) { var meta = ESC.find(function (e) { return e > v; }) || ESC[ESC.length - 1]; var prev = Math.max.apply(null, [0].concat(ESC.filter(function (e) { return e <= v; }))); return [meta, Math.max(2, Math.min(100, (v - prev) / Math.max(1, meta - prev) * 100))]; }
  get('data/stats.json').then(function (s) {
    var R = [['YouTube', 'yt_subs', 'https://www.youtube.com/@EnelEnsayoMedia', '#FF0033', '▶', 'suscriptores'],
      ['Facebook', 'fb_fans', 'https://www.facebook.com/enelensayomedia', '#1877F2', 'f', 'seguidores'],
      ['Instagram', 'ig_seguidores', 'https://www.instagram.com/enelensayomedia', '#E1306C', 'IG', 'seguidores'],
      ['Telegram', 'telegram_miembros', 'https://t.me/enelensayomedia', '#229ED9', '✈', 'suscriptores'],
      ['X', 'x_seguidores', 'https://x.com/enelensayo', '#8b87a0', '𝕏', 'seguidores'],
      ['Reproducciones Shorts', 'yt_views_shorts', 'https://www.youtube.com/@EnelEnsayoMedia/shorts', '#FFB300', '👁', 'vistas'],
      ['Reproducciones Longs', 'yt_views_longs', 'https://www.youtube.com/@EnelEnsayoMedia/videos', '#673AB7', '🎬', 'vistas']];
    var el = document.getElementById('sxHitos'); if (!el) return;
    el.innerHTML = R.map(function (r) {
      var v = +s[r[1]] || 0, h = hito(v);
      return '<a class="hito" href="' + r[2] + '" target="_blank" rel="noopener" style="--c:' + r[3] + '"><span class="ic">' + r[4] + '</span><span><b>' + r[0] + '</b>' +
        '<span class="n" data-n="' + v + '">0</span> <em>' + r[5] + '</em><span class="bar"><i style="width:' + h[1].toFixed(0) + '%"></i></span><small>Próximo hito: ' + h[0].toLocaleString('es-MX') + '</small></span></a>';
    }).join('');
    el.querySelectorAll('.n').forEach(function (x) {
      var n = +x.dataset.n, t0 = null; (function p(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); x.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('es-MX'); if (k < 1) requestAnimationFrame(p); })(performance.now());
    });
  }).catch(function () { });
})();
