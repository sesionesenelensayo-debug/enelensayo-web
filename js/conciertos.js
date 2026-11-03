// [.leon 2026-11-03] Pestaña Conciertos: «Festivales y grandes» + «Conciertos locales» con mapa interactivo (Leaflet) alimentado por el buscador de bandas.
(function () {
  if (!document.querySelector('.cx-tab')) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var seguro = function (u) { return /^https?:\/\//i.test(u || '') ? u : ''; };
  var get = function (u) { return fetch(u + '?_=' + Date.now()).then(function (r) { return r.json(); }); };
  var tabs = document.querySelectorAll('.cx-tab'), paneles = document.querySelectorAll('.cx-panel'), mapa = null, capa = null, todos = [];

  function activar(id) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.t === id)); });
    paneles.forEach(function (p) { p.hidden = p.id !== 'cx-' + id; });
    try { history.replaceState(null, '', '#' + id); } catch (e) { }
    if (id === 'locales') { iniciarMapa(); setTimeout(function () { mapa && mapa.invalidateSize(); }, 80); }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { activar(t.dataset.t); }); });

  var fmtFecha = function (f) { if (!f) return 'Sin fecha confirmada'; var d = new Date(f + 'T12:00:00'); return isNaN(d) ? f : d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); };

  // ── Festivales y grandes ──
  get('data/festivales.json').then(function (d) {
    var el = document.getElementById('cxFest'); if (!el) return;
    el.innerHTML = d.festivales.map(function (f) {
      return '<div class="cx-card"><span class="cx-estado">' + esc(f.estado) + '</span><h3>' + esc(f.nombre) + '</h3>' +
        '<span><b>' + esc(f.fecha) + '</b></span><small>' + esc(f.recinto) + ' · ' + esc(f.ciudad) + '</small>' +
        '<small>Cartel: ' + esc(f.cartel) + '</small><div class="cx-btns">' +
        (seguro(f.boletos) ? '<a class="cx-btn" href="' + esc(f.boletos) + '" target="_blank" rel="noopener nofollow">Boletos</a>' : '') +
        (seguro(f.oficial) ? '<a class="cx-btn sec" href="' + esc(f.oficial) + '" target="_blank" rel="noopener nofollow">Sitio oficial</a>' : '') + '</div></div>';
    }).join('');
  }).catch(function () { });

  // ── Conciertos locales: mapa ──
  function iniciarMapa() {
    if (mapa || !window.L) return;
    mapa = L.map('cxMapa', { scrollWheelZoom: false }).setView([23.6, -102.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(mapa);
    capa = L.layerGroup().addTo(mapa);
    get('data/conciertos_locales.json').then(function (d) { todos = d.eventos || []; llenarEstados(); pintar(); }).catch(function () { pintar(); });
  }
  function llenarEstados() {
    var s = document.getElementById('cxEstado'); if (!s) return;
    var est = Array.from(new Set(todos.map(function (e) { return e.estado; }))).sort();
    s.innerHTML = '<option value="">Todos los estados</option>' + est.map(function (e) { return '<option>' + esc(e) + '</option>'; }).join('');
  }
  function popup(e) {
    return '<b>' + esc(e.banda) + '</b><br>' + esc(e.ciudad) + (e.recinto ? ' · ' + esc(e.recinto) : '') + '<br>' +
      (e.tipo === 'show' ? '📅 ' + esc(fmtFecha(e.fecha)) + (e.hora ? ' · ' + esc(e.hora) : '') + (e.precio ? '<br>🎟 ' + esc(e.precio) : '') : 'Banda local · aún sin fecha confirmada') +
      (seguro(e.boletos) ? '<br><a href="' + esc(e.boletos) + '" target="_blank" rel="noopener nofollow">Comprar boletos</a>' : '');
  }
  function pintar() {
    var q = (document.getElementById('cxBuscar').value || '').toLowerCase().trim(), st = document.getElementById('cxEstado').value, solo = document.getElementById('cxSolo').checked;
    var l = todos.filter(function (e) {
      return (!q || (e.banda + ' ' + e.ciudad + ' ' + (e.genero || '')).toLowerCase().indexOf(q) >= 0) && (!st || e.estado === st) && (!solo || e.tipo === 'show');
    }).sort(function (a, b) { return (a.fecha || '9999') < (b.fecha || '9999') ? -1 : 1; });
    if (capa) capa.clearLayers();
    var lista = document.getElementById('cxLista'), pts = [];
    lista.innerHTML = l.length ? '' : '<p class="cx-vacio">Aún no hay conciertos locales con esos filtros. El mapa se llena solo con cada banda que descubrimos.</p>';
    l.forEach(function (e, i) {
      if (capa) {
        var jit = [e.lat + (((i * 37) % 10) - 5) * 0.0045, e.lon + (((i * 53) % 10) - 5) * 0.0045];   // separa puntos de una misma ciudad
        var m = L.circleMarker(jit, { radius: e.tipo === 'show' ? 10 : 7, color: '#0b0812', weight: 2, fillColor: e.tipo === 'show' ? '#ffe53b' : '#8b7bff', fillOpacity: .95 }).bindPopup(popup(e));
        m.addTo(capa); pts.push(jit); e._m = m;
      }
      var c = document.createElement('div'); c.className = 'cx-ev';
      c.innerHTML = '<b>' + esc(e.banda) + '</b><span>' + esc(e.ciudad) + (e.recinto ? ' · ' + esc(e.recinto) : '') + '</span><span>' + (e.tipo === 'show' ? '📅 ' + esc(fmtFecha(e.fecha)) : 'Sigue su agenda') + '</span>';
      c.addEventListener('click', function () { if (e._m && mapa) { mapa.setView([e.lat, e.lon], 11); e._m.openPopup(); window.scrollTo({ top: document.getElementById('cxMapa').offsetTop - 90, behavior: 'smooth' }); } });
      lista.appendChild(c);
    });
    if (mapa && pts.length) mapa.fitBounds(pts, { padding: [40, 40], maxZoom: 9 });
  }
  ['cxBuscar', 'cxEstado', 'cxSolo'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('input', pintar); });
  activar(location.hash === '#locales' ? 'locales' : 'grandes');
})();
