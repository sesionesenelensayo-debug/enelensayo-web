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
    var nts = (s.noticias || []).slice(0, 2).map(function (n) {
      return '<li><a href="' + esc(n.link) + '" target="_blank" rel="noopener nofollow">' + esc(n.titulo) + '</a> <small>' + esc(n.medio) + ' · ' + fecha(n.fecha) + '</small></li>';
    }).join('');
    return '<article class="st-card st-c' + (i % 5) + '"><div class="st-top"><div class="st-av' + (s.img ? '' : ' sinfoto') + '" data-ini="' + esc(ini(s.nombre)) + '">' + foto + '</div>' +
      '<span class="st-pos">#' + (i + 1) + '</span></div>' +
      '<h3>' + esc(s.nombre) + '</h3><p class="st-pais">' + esc(s.bandera || '') + ' ' + esc(s.pais) + '</p>' +
      '<div class="st-plats">' + (s.plataformas || []).map(plat).join('') + '</div>' +
      (s.dato ? '<p class="st-dato">' + esc(s.dato) + '</p>' : '') +
      (nts ? '<ul class="st-nts">' + nts + '</ul>' : '<p class="st-sin">Sin titulares recientes.</p>') +
      (s.credito ? '<small class="st-cred"><a href="' + esc(s.credito_url || '#') + '" target="_blank" rel="noopener nofollow">' + esc(s.credito) + '</a></small>' : '') + '</article>';
  };

  get('data/streaming.json').then(function (d) {
    var ss = d.streamers || [];
    var hero = document.getElementById('stHero');
    var kai = ss.filter(function (s) { return /kai-cenat|ishowspeed|ibai/.test(s.slug); });
    hero.innerHTML = kai.map(function (s) {
      return '<a class="st-big" href="' + esc((s.plataformas[0] || {}).url) + '" target="_blank" rel="noopener nofollow"><span class="st-big-t">' + esc(s.bandera) + ' ' + esc(s.pais) + '</span><b>' + esc(s.nombre) + '</b><small>' + esc(s.dato) + '</small></a>';
    }).join('');
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
    var ch = d.chisme || [];
    document.getElementById('stChisme').innerHTML = ch.length ? ch.map(function (n) {
      return '<a class="st-ch" href="' + esc(n.link) + '" target="_blank" rel="noopener nofollow"><span>' + esc(n.titulo) + '</span><small>' + esc(n.medio) + ' · ' + fecha(n.fecha) + '</small></a>';
    }).join('') : '<p class="sx-vacio">Sin titulares nuevos por ahora.</p>';
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
