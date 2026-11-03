// [.leon 2026-11-03] Pestaña Conciertos: «Festivales y grandes» + «Conciertos locales» con mapa SVG por estados (estilo OKpolítico) alimentado por el buscador de bandas.
(function () {
  if (!document.querySelector('.cx-tab')) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var seguro = function (u) { return /^https?:\/\//i.test(u || '') ? u : ''; };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var tabs = document.querySelectorAll('.cx-tab'), paneles = document.querySelectorAll('.cx-panel');
  var NS = 'http://www.w3.org/2000/svg';
  var ALIAS = { 'cdmx': 'Distrito Federal', 'ciudad de mexico': 'Distrito Federal', 'estado de mexico': 'México', 'mexico': 'México' };
  var norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); };
  var fmtFecha = function (f) { if (!f) return 'Sin fecha confirmada'; var d = new Date(f + 'T12:00:00'); return isNaN(d) ? f : d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); };

  function activar(id) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.t === id)); });
    paneles.forEach(function (p) { p.hidden = p.id !== 'cx-' + id; });
    try { history.replaceState(null, '', '#' + id); } catch (e) { }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { activar(t.dataset.t); }); });

  // ── Festivales y grandes ──
  get('data/festivales.json').then(function (d) {
    var el = document.getElementById('cxFest'); if (!el) return;
    el.innerHTML = d.festivales.map(function (f) {
      return '<div class="cx-card"><span class="cx-estado">' + esc(f.estado) + '</span><h3>' + esc(f.nombre) + '</h3><span><b>' + esc(f.fecha) + '</b></span><small>' + esc(f.recinto) + ' · ' + esc(f.ciudad) + '</small>' +
        '<small>Cartel: ' + esc(f.cartel) + '</small><div class="cx-btns">' + (seguro(f.boletos) ? '<a class="cx-btn" href="' + esc(f.boletos) + '" target="_blank" rel="noopener nofollow">Boletos</a>' : '') +
        (seguro(f.oficial) ? '<a class="cx-btn sec" href="' + esc(f.oficial) + '" target="_blank" rel="noopener nofollow">Sitio oficial</a>' : '') + '</div></div>';
    }).join('');
  }).catch(function () { });

  // ── Conciertos locales: mapa SVG por estados ──
  var geo, items = [], foros = [], sel = '', paths = {}, svg = document.getElementById('cxSvg'), vista = 'zm';
  var VISTAS = { zm: { n: '🔎 Valle de México', lon0: -99.45, lon1: -98.8, lat0: 19.12, lat1: 19.78 }, gdl: { n: '🔎 Guadalajara', lon0: -103.6, lon1: -103.1, lat0: 20.45, lat1: 20.9 }, mty: { n: '🔎 Monterrey', lon0: -100.65, lon1: -100.05, lat0: 25.5, lat1: 25.95 }, mx: { n: '🇲🇽 Todo México' } };
  var capa = document.getElementById('cxCapa'), buscar = document.getElementById('cxBuscar'), tip = document.getElementById('cxTip'), rk = document.getElementById('cxRk'), lista = document.getElementById('cxLista');
  var clave = function (estado) { var n = norm(estado); return ALIAS[n] || (geo.estados.filter(function (e) { return norm(e.n) === n || norm(e.k) === n; })[0] || {}).k || estado; };
  var proy = function (lon, lat) { return [(lon - geo.lon0) * geo.kx, (geo.lat1 - lat) * geo.ky]; };
  var rampa = function (t) { var a = [30, 22, 52], b = [255, 229, 59]; return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * t); }).join(',') + ')'; };

  function datos() {
    var c = capa.value, q = norm(buscar.value), l = [];
    items.forEach(function (e) { if (c === 'todo' || c === e.tipo) l.push(e); });
    if (c === 'foro' || c === 'todo') foros.forEach(function (f) { l.push({ tipo: 'foro', banda: f.nombre, ciudad: f.ciudad, estado: f.estado, recinto: f.zona || '', genero: f.genero, lat: f.lat, lon: f.lon, sitio: f.url }); });
    l.forEach(function (e) { e._k = clave(e.estado); });
    return l.filter(function (e) { return !q || norm(e.banda + ' ' + e.ciudad + ' ' + (e.genero || '') + ' ' + (e.recinto || '')).indexOf(q) >= 0; });
  }
  function aplicarVista() {
    var v = VISTAS[vista] || VISTAS.zm;
    if (vista !== 'mx') { var a = proy(v.lon0, v.lat1), b = proy(v.lon1, v.lat0); svg.setAttribute('viewBox', a[0] + ' ' + a[1] + ' ' + (b[0] - a[0]) + ' ' + (b[1] - a[1])); }
    else svg.setAttribute('viewBox', '0 0 ' + geo.w + ' ' + geo.h);
    svg.classList.toggle('zm', vista !== 'mx');
    var sv = document.getElementById('cxVista'); if (sv) sv.value = vista;
  }
  function dibujar() {
    aplicarVista();
    var l = datos(), cuenta = {}, max = 0;
    l.forEach(function (e) { cuenta[e._k] = (cuenta[e._k] || 0) + 1; max = Math.max(max, cuenta[e._k]); });
    geo.estados.forEach(function (e) { var n = cuenta[e.k] || 0; paths[e.k].style.fill = n ? rampa(.25 + .75 * n / (max || 1)) : '#1b1430'; paths[e.k].classList.toggle('on', e.k === sel); });
    Array.prototype.slice.call(svg.querySelectorAll('circle')).forEach(function (c) { c.remove(); });
    l.forEach(function (e, i) {
      if (typeof e.lat !== 'number') return;
      var k = vista !== 'mx' ? .22 : 1, p = proy(e.lon, e.lat), c = document.createElementNS(NS, 'circle'), j = ((i * 37) % 7 - 3) * 1.4 * k;
      c.setAttribute('cx', p[0] + j); c.setAttribute('cy', p[1] + (((i * 53) % 7) - 3) * 1.4 * k); c.setAttribute('r', (e.tipo === 'show' ? 5 : 4) * (vista !== 'mx' ? .45 : 1)); c.setAttribute('vector-effect', 'non-scaling-stroke');
      c.setAttribute('fill', e.tipo === 'show' ? '#ffe53b' : e.tipo === 'banda' ? '#8b7bff' : '#fff');
      if (e.tipo === 'foro') { c.setAttribute('stroke', '#8b7bff'); c.setAttribute('stroke-width', 2); }
      c.addEventListener('mouseenter', function () { tip.innerHTML = '<b>' + esc(e.banda) + '</b>' + esc(e.ciudad) + (e.tipo === 'show' ? ' · ' + esc(fmtFecha(e.fecha)) : ''); });
      c.addEventListener('click', function () { sel = e._k; dibujar(); });
      svg.appendChild(c);
    });
    var ks = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; });
    rk.innerHTML = ks.length ? ks.map(function (k) { return '<div data-k="' + esc(k) + '" class="' + (k === sel ? 'on' : '') + '"><span>' + esc((geo.estados.filter(function (e) { return e.k === k; })[0] || { n: k }).n) + '</span><span>' + cuenta[k] + '</span></div>'; }).join('') : '<p class="cx-vacio">Aún no hay registros en esta capa.</p>';
    Array.prototype.forEach.call(rk.querySelectorAll('div'), function (d) { d.addEventListener('click', function () { sel = d.dataset.k === sel ? '' : d.dataset.k; dibujar(); }); });
    if (!sel) tip.innerHTML = '<b>' + (l.length ? l.length + ' en el mapa' : 'El mapa se llena solo') + '</b>' + (l.length ? 'Toca un estado o un punto.' : 'Cada banda que descubrimos aparece aquí con su ciudad y, si hay fecha, sus boletos.');
    var vis = sel ? l.filter(function (e) { return e._k === sel; }) : l;
    vis.sort(function (a, b) { return (a.fecha || '9999') < (b.fecha || '9999') ? -1 : 1; });
    document.getElementById('cxTitLista').textContent = sel ? 'En ' + ((geo.estados.filter(function (e) { return e.k === sel; })[0] || {}).n || sel) : 'Conciertos y foros';
    lista.innerHTML = vis.length ? vis.map(function (e) {
      return '<div class="cx-ev"><b>' + esc(e.banda) + '</b><span>' + esc(e.ciudad) + (e.recinto ? ' · ' + esc(e.recinto) : '') + '</span><span>' + (e.tipo === 'show' ? '📅 ' + esc(fmtFecha(e.fecha)) + (e.hora ? ' · ' + esc(e.hora) : '') + (e.precio ? ' · 🎟 ' + esc(e.precio) : '') + (typeof e.lat !== 'number' && e.tipo === 'show' ? ' · 📍 ubicación por confirmar' : '') : e.tipo === 'foro' ? '🏟 ' + esc(e.genero || 'Foro independiente') : '🎸 Banda local · sigue su agenda') + '</span>' +
        (seguro(e.boletos) ? '<a class="cx-btn" href="' + esc(e.boletos) + '" target="_blank" rel="noopener nofollow">Comprar boletos</a>' : '') +
        (seguro(e.sitio) ? '<a class="cx-btn sec" href="' + esc(e.sitio) + '" target="_blank" rel="noopener nofollow">Sitio del foro</a>' : '') +
        (seguro(e.fuente_url) ? '<a class="cx-btn sec" href="' + esc(e.fuente_url) + '" target="_blank" rel="noopener nofollow">Ver publicación original</a>' : '') +
+ '</div>';
    }).join('') : '<p class="cx-vacio">Nada con estos filtros todavía.</p>';
  }
  function iniciar() {
    if (!svg) return;
    Promise.all([get('data/mx_paths.json'), get('data/conciertos_locales.json').catch(function () { return { eventos: [] }; }), get('data/foros.json').catch(function () { return { foros: [], agendas: [] }; })]).then(function (r) {
      geo = r[0]; items = r[1].eventos || []; foros = r[2].foros || [];
      geo.estados.forEach(function (e) {
        var p = document.createElementNS(NS, 'path'); p.setAttribute('d', e.d); p.setAttribute('role', 'button'); p.setAttribute('aria-label', e.n);
        p.addEventListener('mouseenter', function () { var n = datos().filter(function (x) { return x._k === e.k; }).length; tip.innerHTML = '<b>' + esc(e.n) + '</b>' + n + (n === 1 ? ' registro' : ' registros'); });
        p.addEventListener('click', function () { sel = sel === e.k ? '' : e.k; dibujar(); });
        svg.appendChild(p); paths[e.k] = p;
      });
      var ag = document.getElementById('cxAgendas');
      if (ag) ag.innerHTML = (r[2].agendas || []).map(function (a) { return '<a class="sx-chip" href="' + esc(a.url) + '" target="_blank" rel="noopener nofollow"><b>' + esc(a.nombre) + '</b><small> ' + esc(a.desc) + '</small></a>'; }).join('');
      capa.addEventListener('input', function () { sel = ''; dibujar(); }); buscar.addEventListener('input', dibujar);
      document.getElementById('cxTodos').addEventListener('click', function () { sel = ''; buscar.value = ''; dibujar(); });
      var sv = document.getElementById('cxVista'); if (sv) sv.addEventListener('input', function () { vista = sv.value; dibujar(); });
      dibujar();
    }).catch(function () { tip.innerHTML = '<b>Mapa no disponible</b>Intenta de nuevo en unos minutos.'; });
  }
  iniciar();
  activar(location.hash === '#locales' ? 'locales' : 'grandes');
})();
