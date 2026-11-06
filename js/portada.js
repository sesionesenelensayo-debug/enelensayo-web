// Portada: nota de las 12, Top 20 Spotify, próximos conciertos, todas las notas y videos
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  var num = function (n) { return Number(n).toLocaleString('es-MX'); };
  var fc = function (f) { var d = new Date(f); return isNaN(d) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); };
  var foto = function (u) { return u ? '<img src="' + esc(u) + '" alt="" loading="lazy" onerror="this.remove()">' : ''; };
  var corta = function (t) { if (t.length < 190) return t; return t.slice(0, 200).replace(/\s+\S*$/, '') + '…'; };
  var cat = function (a) { return a.categoria || (/fallece|muere|muri/i.test(a.titulo) ? 'In memoriam' : 'Reportaje'); };
  var href = function (a) { var u = a.url || a.telegraph_url || ''; return u && u !== 'https://telegra.ph' ? u : '#notas'; };

  var f = $('fechaSx'); if (f) f.textContent = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · Noticias y cultura musical de México';

  get('data/stats.json').then(function (s) { var t = $('tgCuenta'); if (t && +s.telegram_miembros > 0) t.textContent = '· ya somos ' + num(s.telegram_miembros); }).catch(function () { });

  // «hace 25 min» para lo recién publicado
  function haceUn(f) {
    var m = (Date.now() - new Date(f).getTime()) / 60000;
    if (isNaN(m) || m < 0 || m > 360) return '';
    var t = m < 60 ? 'hace ' + Math.max(1, Math.round(m)) + ' min' : 'hace ' + Math.round(m / 60) + ' h';
    return ' · <b class="nuevo">' + t + '</b>';
  }

  // Carrusel de la nota del día: cambia solo cada 7 s, se detiene al pasar el cursor y admite deslizar con el dedo
  function carrusel(w) {
    var sl = w.querySelectorAll('.slide'), pt = w.querySelectorAll('.car-ctl button'), bar = w.querySelector('.car-bar i');
    if (sl.length < 2) { var c = w.querySelector('.car-ctl'); if (c) c.hidden = true; return; }
    var i = 0, t = null, quieto = false, reducido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function ir(n) {
      i = (n + sl.length) % sl.length;
      sl.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      pt.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = reducido ? 'none' : ''; }
    }
    function arranca() { clearInterval(t); if (!reducido) t = setInterval(function () { if (!quieto && !document.hidden) ir(i + 1); }, 7000); }
    pt.forEach(function (b, k) { b.onclick = function () { ir(k); arranca(); }; });
    w.addEventListener('mouseenter', function () { quieto = true; w.classList.add('pausa'); });
    w.addEventListener('mouseleave', function () { quieto = false; w.classList.remove('pausa'); ir(i); });
    var x0 = null;
    w.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    w.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { ir(i + (dx < 0 ? 1 : -1)); arranca(); } x0 = null; }, { passive: true });
    ir(0); arranca();
  }

  // ── Notas ──
  var TODAS = [], SHOWN = 12;
  function esNotaDia(a) {
    if (a.nota_dia) return true;
    var d = new Date(a.fecha); var h = d.getHours() + d.getMinutes() / 60;
    return h >= 11.9 && h < 14 && (Date.now() - d.getTime()) < 36 * 3600 * 1000;   // respaldo: la nota de ~12:00 de las últimas 36 h (nunca de archivo)
  }
  function pintaNotas() {
    var g = $('todasNotas'); if (!g) return;
    g.innerHTML = TODAS.slice(0, SHOWN).map(function (a) {
      return '<a class="sx-card" href="' + esc(href(a)) + '" target="_blank" rel="noopener"><div class="foto">' + foto(a.imagen_url) + '</div><div class="cuerpo">' +
        '<span class="sx-tag">' + esc(cat(a)) + '</span><h3>' + esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || a.tipo) + '</b><span>' + fc(a.fecha) + '</span></span></div></a>';
    }).join('');
    var b = $('masNotas'); if (b) b.hidden = SHOWN >= TODAS.length;
  }
  var mas = $('masNotas'); if (mas) mas.onclick = function () { SHOWN += 12; pintaNotas(); };

  get('data/articles.json').then(function (arts) {
    arts.forEach(function (a) { if (a.actualizada && a.fecha_original) a.fecha = a.fecha_original; });   // [e.leo 2026-11-05] en la PORTADA no hay «actualizaciones»: una nota ampliada cuenta con su fecha ORIGINAL
    TODAS = arts.filter(function (a) { return !a.archivo; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    var MUS = ['Música', 'Escena local', 'Internacional', 'Conciertos', 'Discos de la semana'];
    var recientes = TODAS.filter(function (a) { return (Date.now() - new Date(a.fecha).getTime()) < 48 * 3600 * 1000; });
    // la nota principal es de MÚSICA ACTUAL (con foto, de las últimas 48 h); si no hay, la marcada «nota del día»; nunca de archivo
    var uh = recientes.find(function (a) { return a.ultima_hora && a.imagen_url && (Date.now() - new Date(a.fecha).getTime()) < 24 * 3600 * 1000; });   // [e.leo] última hora (radar, gravedad ≥ 9) abre la portada 24 h
    var nd = uh || recientes.find(function (a) { return MUS.indexOf(a.categoria) >= 0 && a.imagen_url && a.categoria !== 'Discos de la semana'; }) || TODAS.find(esNotaDia) || TODAS[0];
    var w = $('notaDiaPortada');
    // [e.leo 2026-11-05] PORTADA DINÁMICA: un solo destacado por GRUPO (chisme, videojuegos, cine/TV, opinión, música…), sin repetir tema/artista; el orden de los grupos rota cada hora
    var GRP = { 'Conciertos': 'musica', 'Música': 'musica', 'Escena local': 'musica', 'Internacional': 'musica', 'Discos de la semana': 'musica', 'Chisme': 'chisme', 'Chisme internacional': 'chisme',
      'Videojuegos': 'juegos', 'Esports': 'juegos', 'Cine': 'cine', 'Televisión': 'cine', 'Series': 'cine', 'Marvel y DCU': 'opinion', 'Agenda woke': 'opinion', 'Cultura': 'cultura', 'In memoriam': 'cultura',
      'Reportaje': 'cultura', 'Biografía': 'cultura', 'Terror': 'terror', 'Terror y misterio': 'terror', 'Historias de terror': 'terror', 'Luchas': 'luchas' };
    var grp = function (a) { return GRP[a.categoria] || 'otros'; };
    var norm = function (t) { return String(t || '').toLowerCase().replace(/[^a-z0-9áéíóúñ ]/g, '').split(' ').filter(function (w) { return w.length > 3; }).slice(0, 4).join(' '); };
    var slides = [];
    if (nd) {
      slides = [nd];
      var usadosG = {}; usadosG[grp(nd)] = 1;
      var vistos = {}; vistos[norm(nd.titulo)] = 1; vistos[norm(nd.artista)] = 1;
      var ORDEN = ['chisme', 'juegos', 'cine', 'opinion', 'cultura', 'terror', 'luchas', 'musica'];
      var rot = Math.floor(Date.now() / 3600000) % ORDEN.length;
      ORDEN = ORDEN.slice(rot).concat(ORDEN.slice(0, rot));
      ORDEN.forEach(function (g) {
        if (slides.length >= 5 || usadosG[g]) return;
        var c = TODAS.find(function (a) { return grp(a) === g && a.imagen_url && (Date.now() - new Date(a.fecha).getTime()) < 72 * 3600 * 1000 && !vistos[norm(a.titulo)] && !vistos[norm(a.artista)]; });
        if (c) { slides.push(c); usadosG[g] = 1; vistos[norm(c.titulo)] = 1; vistos[norm(c.artista)] = 1; }
      });
      if (slides.length < 4) TODAS.forEach(function (a) { if (slides.length < 4 && slides.indexOf(a) < 0 && a.imagen_url && !vistos[norm(a.titulo)]) { slides.push(a); vistos[norm(a.titulo)] = 1; } });
    }
    if (nd && w) {
      w.innerHTML = '<div class="carrusel">' + slides.map(function (a, i) {
        var hoy = new Date(a.fecha).toDateString() === new Date().toDateString();
        var etq = i === 0 ? 'Nota del día' : 'Destacada';
        return '<a class="destacada-sx slide' + (i === 0 ? ' on' : '') + '" href="' + esc(href(a)) + '" target="_blank" rel="noopener"><div class="foto">' + (a.imagen_url ? foto(a.imagen_url) : '🎵') +
          '</div><div class="txt"><span class="chip-sx"><span class="dot dot--live"></span>' + etq + ' · ' + esc(cat(a)) + (hoy ? '' : ' · ' + fc(a.fecha)) + haceUn(a.fecha) + '</span><h2>' + esc(a.titulo) + '</h2>' +
          '<p>' + esc(corta(a.intro || '')) + '</p><div class="meta"><span>' + esc(a.artista || '') + ' · ' + fc(a.fecha) + '</span><span class="leer">Leer nota →</span></div></div></a>';
      }).join('') + '</div><div class="car-ctl">' + slides.map(function (a, i) { return '<button type="button" aria-label="Nota ' + (i + 1) + '"' + (i === 0 ? ' class="on"' : '') + '></button>'; }).join('') + '<span class="car-bar"><i></i></span></div>';
      carrusel(w);
    }
    var o = $('otrasNotas');
    if (o) o.innerHTML = TODAS.filter(function (a) { return slides.indexOf(a) < 0; }).slice(0, 3).map(function (a) {
      return '<a class="otra" href="' + esc(href(a)) + '" target="_blank" rel="noopener"><div class="foto">' + foto(a.imagen_url) + '</div><h3><span class="sx-tag" style="margin-right:6px">' + esc(cat(a)) + '</span>' + esc(a.titulo) + '</h3><small>' + fc(a.fecha) + '</small></a>';
    }).join('');
    var uh = $('cintaUh');
    if (uh && TODAS.length) {
      var h = TODAS.slice(0, 8).map(function (a) { return '<a href="' + esc(href(a)) + '" target="_blank" rel="noopener">' + esc(a.titulo) + '</a>'; }).join('');
      uh.innerHTML = h + h; $('tiraUh').hidden = false;
    }
    pintaNotas();
  }).catch(function () { });

  // ── Videos ──
  get('data/videos.json').then(function (v) {
    var L = (v.longs || []).map(function (x) { x.k = 'Documental'; x.u = 'https://www.youtube.com/watch?v='; return x; })
      .concat((v.shorts || []).map(function (x) { x.k = 'Short'; x.u = 'https://www.youtube.com/shorts/'; return x; }))
      .sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); }).slice(0, 18);
    var g = $('todosVideos'); if (!g) return;
    g.innerHTML = L.map(function (x) {
      return '<a class="sx-card" href="' + x.u + esc(x.id) + '" target="_blank" rel="noopener"><div class="foto"><img src="https://i.ytimg.com/vi/' + esc(x.id) + '/hqdefault.jpg" alt="" loading="lazy"></div>' +
        '<div class="cuerpo"><span class="sx-tag">' + x.k + '</span><h3>' + esc(x.titulo) + '</h3><span class="sx-meta"><b>YouTube</b><span>' + fc(x.fecha) + '</span></span></div></a>';
    }).join('');
  }).catch(function () { });

  // ── Spotify ──
  var SP = null, TAB = 'mexico';
  function pintaSp() {
    var l = $('spLista'); if (!l || !SP) return;
    var datos = SP[TAB] && SP[TAB].length ? SP[TAB] : (SP.mundo || []);
    l.innerHTML = datos.map(function (x) {
      return '<li><span class="n">' + x.n + '</span><a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.nombre) + '</a><small>' + (TAB === 'mundo' ? num(x.valor) + ' oyentes' : num(x.valor) + ' repr.') + '</small></li>';
    }).join('');
    var fu = $('spFuente'); if (fu) fu.textContent = (TAB === 'mundo' ? 'Oyentes mensuales en el mundo' : 'Reproducciones de hoy en México') + ' · ' + SP.fuente + ' · ' + (SP.actualizado || '');
    var c = $('cintaSp');
    if (c) { var t = (SP.mexico || SP.mundo).slice(0, 10).map(function (x) { return '<span><b>#' + x.n + '</b> ' + esc(x.nombre) + '</span>'; }).join(''); c.innerHTML = '<span><b>🔥 Spotify México hoy</b></span>' + t + '<span><b>🔥 Spotify México hoy</b></span>' + t; }
  }
  document.querySelectorAll('.pestanas button').forEach(function (b) {
    b.onclick = function () { TAB = b.dataset.sp; document.querySelectorAll('.pestanas button').forEach(function (x) { x.classList.toggle('on', x === b); }); pintaSp(); };
  });
  function cargaSp() { get('data/spotify.json').then(function (d) { SP = d; pintaSp(); }).catch(function () { }); }
  cargaSp(); setInterval(cargaSp, 600000);

  // ── Notas recientes (antes «Próximos conciertos») [.leon 2026-11-05]: lista cronológica de TODAS las notas para encontrar la que enlaza Instagram ──
  function cargaConc() {
    get('data/articles.json').then(function (arts) {
      var l = $('concLista'); if (!l) return;
      arts = (arts || []).filter(function (a) { return !a.archivo; });
      arts.forEach(function (a) { if (a.actualizada && a.fecha_original) a.fecha = a.fecha_original; });
      arts.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
      var h = arts.slice(0, 40).map(function (a) {
        var d = new Date(a.fecha), hh = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
        return '<li><a href="' + esc(href(a)) + '"><span class="sx-tag" style="margin-right:6px">' + esc(cat(a)) + '</span>' + esc(a.titulo) + '</a><small>' + fc(a.fecha) + ' · ' + hh + '</small></li>';
      }).join('');
      l.innerHTML = h || '<li class="sx-vacio">Sin notas por ahora.</li>';
    }).catch(function () { });
  }
  cargaConc(); setInterval(cargaConc, 600000);
})();
