// Sección Live Streaming: data/streaming.json (streamers de México, LATAM e internacionales, titulares y chisme) y notas propias (categoría Streaming)
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var fecha = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var GRUPOS = [
    { id: 'mexico', et: 'México', titulo: 'Los 10 streamers de México', aviso: 'Selección editorial de los mexicanos más grandes de Twitch, Kick y YouTube.' },
    { id: 'latam', et: 'Latinoamérica', titulo: 'Los 10 de Latinoamérica', aviso: 'Colombia, Argentina, Perú y República Dominicana mandan en Kick; estos son los canales que más ve la comunidad hispana.' },
    { id: 'internacional', et: 'Internacional', titulo: 'Los gigantes internacionales', aviso: 'Kai Cenat, IShowSpeed e Ibai encabezan a los que también arrastran audiencia latina en EE. UU., México y toda LATAM.' }
  ];
  var plat = function (p) { return '<a class="st-plat st-' + esc(p.nombre.toLowerCase()) + '" href="' + esc(p.url) + '" target="_blank" rel="noopener nofollow">' + esc(p.nombre) + ' ↗</a>'; };
  var ini = function (n) { return n.replace(/[^A-Za-z0-9 ]/g, '').split(' ').slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase() || '?'; };
  var tarjeta = function (s, i) {
    var foto = s.img ? '<img loading="lazy" src="' + esc(s.img) + '" alt="' + esc(s.nombre) + '" onerror="this.parentNode.classList.add(\'sinfoto\');this.remove()">' : '';
    return '<article class="st-card st-c' + (i % 5) + '"><div class="st-top"><div class="st-av' + (s.img ? '' : ' sinfoto') + '" data-ini="' + esc(ini(s.nombre)) + '">' + foto + '</div>' +
      '<span class="st-pos">#' + (i + 1) + '</span></div>' +
      '<h3>' + esc(s.nombre) + '</h3><p class="st-pais">' + esc(s.bandera || '') + ' ' + esc(s.pais) + '</p>' +
      '<div class="st-plats">' + (s.plataformas || []).map(plat).join('') + '</div>' +
      (s.dato ? '<p class="st-dato">' + esc(s.dato) + '</p>' : '') +
      (s.credito ? '<small class="st-cred"><a href="' + esc(s.credito_url || '#') + '" target="_blank" rel="noopener nofollow">' + esc(s.credito) + '</a></small>' : '') + '</article>';
  };

  get('data/streaming.json').then(function (d) {
    var ss = d.streamers || [];
    var bySlug = {}; ss.forEach(function (x) { bySlug[x.slug] = x; });
    var M = function (n) { return n ? (n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + ' M' : Math.round(n / 1e3) + ' mil') : '—'; };
    var dest = d.destacados || {};
    var tarj = function (slug, i, cls) {
      var s = bySlug[slug]; if (!s) return '';
      var fila = (d.comparativa || []).filter(function (f) { return f.slug === slug; })[0] || {};
      return '<a class="st-big st-b' + (i % 5) + '" href="' + esc((s.plataformas[0] || {}).url) + '" target="_blank" rel="noopener nofollow"><span class="st-big-t">' + esc(s.bandera) + ' ' + esc(s.pais) + '</span><b>' + esc(s.nombre) + '</b>' +
        '<span class="st-big-n">' + M(fila.total) + '</span><small>seguidores · ' + esc((s.plataformas || []).map(function (p) { return p.nombre; }).join(' · ')) + '</small><span class="st-big-ir">Ir a su canal →</span></a>';
    };
    document.getElementById('stHeroMx').innerHTML = (dest.mexico || []).map(tarj).join('');
    document.getElementById('stHeroEx').innerHTML = (dest.extranjeros || []).map(tarj).join('');
    var comp = d.comparativa || [], max = Math.max.apply(null, comp.map(function (f) { return f.total; }).concat([1]));
    document.getElementById('stTabla').innerHTML = comp.map(function (f, i) {
      return '<tr><td>' + (i + 1) + '</td><td><a href="' + esc(f.url) + '" target="_blank" rel="noopener nofollow"><b>' + esc(f.nombre) + '</b></a><small>' + esc(f.bandera) + ' ' + esc(f.pais) + '</small></td>' +
        '<td>' + M(f.twitch) + '</td><td>' + M(f.kick) + '</td><td>' + M(f.youtube) + '</td>' +
        '<td class="st-tot"><b>' + M(f.total) + '</b><span class="st-barra"><i class="' + (f.mexicano ? 'mx' : 'ex') + '" style="width:' + Math.max(2, Math.round(f.total / max * 100)) + '%"></i></span></td></tr>';
    }).join('');
    document.getElementById('stTablaAviso').textContent = 'Seguidores en Twitch, Kick y YouTube (verde: mexicanos · morado: extranjeros). El total suma las plataformas, así que hay audiencia repetida; “—” = no transmite ahí o no tenemos la cifra verificada. ' + (d.fuente_seguidores || '') + ', ' + (d.actualizado || '') + '.';
    var tops = d.tops || {}, TN = [['twitch', 'Twitch'], ['kick', 'Kick'], ['youtube', 'YouTube']];
    var pintaTop = function (id) {
      var l = tops[id] || [], mx = Math.max.apply(null, l.map(function (x) { return x.seguidores; }).concat([1]));
      var f = document.getElementById('stTopsFiltros');
      f.innerHTML = TN.map(function (t) { return '<button type="button" class="lu-chip' + (t[0] === id ? ' on' : '') + '" data-v="' + t[0] + '">' + t[1] + '</button>'; }).join('');
      Array.prototype.forEach.call(f.querySelectorAll('button'), function (b) { b.onclick = function () { pintaTop(b.getAttribute('data-v')); }; });
      document.getElementById('stTops').innerHTML = l.map(function (x, i) {
        return '<tr><td>' + (i + 1) + '</td><td><a href="' + esc(x.url) + '" target="_blank" rel="noopener nofollow"><b>' + esc(x.nombre) + '</b></a><small>' + esc(x.bandera) + ' ' + esc(x.pais) + '</small></td>' +
          '<td class="st-tot"><b>' + M(x.seguidores) + '</b><span class="st-barra"><i class="' + (x.mexicano ? 'mx' : 'ex') + '" style="width:' + Math.max(2, Math.round(x.seguidores / mx * 100)) + '%"></i></span></td></tr>';
      }).join('') || '<tr><td colspan="3">Sin datos por ahora.</td></tr>';
    };
    pintaTop('twitch');
    document.getElementById('stTopsAviso').textContent = 'Los 10 canales más grandes de cada plataforma entre los streamers de México y toda Latinoamérica (sin España ni EE. UU.), ordenados por seguidores o suscriptores en vivo. Verde: mexicanos. En YouTube entran también creadores de gaming que transmiten en vivo. Selección entre los canales que seguimos; ' + (d.actualizado || '') + '.';
    var pinta = function (id) {
      var g = GRUPOS.filter(function (x) { return x.id === id; })[0];
      var el = document.getElementById('stFiltros');
      el.innerHTML = GRUPOS.map(function (x) { return '<button type="button" class="lu-chip' + (x.id === id ? ' on' : '') + '" data-v="' + x.id + '">' + esc(x.et) + '</button>'; }).join('');
      Array.prototype.forEach.call(el.querySelectorAll('button'), function (b) { b.onclick = function () { pinta(b.getAttribute('data-v')); }; });
      document.getElementById('stTitulo').textContent = g.titulo;
      document.getElementById('stAviso').textContent = g.aviso;
      document.getElementById('stGrid').innerHTML = ss.filter(function (s) { return s.grupo === id; }).map(tarjeta).join('');
    };
    pinta('mexico');
    var av = document.getElementById('stAviso');
    av.textContent += ' Datos: ' + (d.fuente || '') + '. Actualizado ' + (d.actualizado || '') + '.';
  }).catch(function () { });

  get('data/articles.json').then(function (arts) {
    var el = document.getElementById('stNotas'); if (!el) return;
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Streaming'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); }).slice(0, 12);
    if (!l.length) { el.innerHTML = '<p class="sx-vacio">Pronto: polémicas, récords y todo el chisme de Twitch y Kick.</p>'; return; }
    el.innerHTML = l.map(function (a) {
      return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">Live Streaming</span><h3>' +
        esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });
})();
