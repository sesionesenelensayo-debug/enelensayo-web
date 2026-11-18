// Publicidad del portal (método de OKpolítico): espacios «cabecera» y «nota»; vendido → anuncio rotulado «Publicidad»;
// libre → invitación a anunciarse. Más un contador de visitas anónimo (sin datos personales) para medir la audiencia.
(function () {
  // [e.leo 2026-11-02] Un espacio de AdSense SIN anuncio no ocupa lugar: colapsado y sin rótulo hasta que Google lo llena (clase «listo»); y nunca más alto que 340 px.
  try {
    var st = document.createElement('style');
    st.textContent = '.ad.adsense:not(.listo){height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;opacity:0}' +
      '.ad.adsense:not(.listo) .adsbygoogle{min-height:0!important}.ad.adsense .adsbygoogle{max-height:340px;overflow:hidden}';
    document.head.appendChild(st);
  } catch (e) { }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // [e.leo] CONTEO LIMPIO: cada visita se clasifica como real, prueba o bot y va a contadores distintos (namespace enelensayo-mx2).
  //   prueba = localhost / vista previa / otro dominio que no sea el de producción, dispositivos marcados con ?yo=1 (dueño) o ?prueba=1
  //   bot    = navegadores automatizados y rastreadores (HeadlessChrome, Lighthouse, vistas previas de redes, etc.)
  //   El histórico anterior (mezclado, incluye pruebas) quedó en el namespace enelensayo-mx.
  var A = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx2/';
  // [.leon 2026-11-17] Contador propio en Cloudflare (Worker eem-visitas), en paralelo a Abacus, como el de OKpolítico: UNA sola petición agrupada por visita (sendBeacon al ocultar la página
  // o a los 2.5 s), sin el límite de ~30 peticiones/10 s por IP de Abacus. Vacío = desactivado (solo Abacus).
  var CF = 'https://eem-visitas.enelensayomedia.workers.dev';
  var Q = [], QT = 0;
  function fl() { if (!Q.length || !CF) return; var b = Q.join(','); Q = []; try { if (navigator.sendBeacon) navigator.sendBeacon(CF + '/b', b); else fetch(CF + '/b', { method: 'POST', body: b, mode: 'no-cors', keepalive: true }); } catch (e) { } }
  addEventListener('pagehide', fl); document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') fl(); });
  function hit(k) {
    try { fetch(A + k, { mode: 'no-cors', keepalive: true }); } catch (e) { }
    if (CF) { try { Q.push(k); clearTimeout(QT); QT = setTimeout(fl, 2500); } catch (e) { } }
  }
  function clasificar() {
    var ua = navigator.userAgent || '', yo = false;
    try {
      if (/[?&]yo=1/.test(location.search)) localStorage.eem_yo = '1';
      if (/[?&]yo=0/.test(location.search)) localStorage.removeItem('eem_yo');
      yo = !!localStorage.eem_yo;
    } catch (e) { }
    if (!/^(www\.)?enelensayomedia\.com$/.test(location.hostname) || yo || /[?&]prueba=1/.test(location.search)) return 'prueba';
    if (navigator.webdriver || /Headless|Playwright|Puppeteer|Selenium|PhantomJS|Lighthouse|PageSpeed|GTmetrix|\bbot\b|bot\/|crawl|spider|slurp|preview|facebookexternalhit|Bytespider|GPTBot|ClaudeBot|Applebot|Google-InspectionTool/i.test(ua)) return 'bot';
    return 'real';
  }
  try {
    var tipo = clasificar(), d = new Date();
    var ymd = new Date(d.getTime() - 216e5).toISOString().slice(0, 10).replace(/-/g, '');   // [.leon 2026-11-17] día en hora de México (UTC-6 fijo), como OKpolítico: el día local del navegador repartía visitas en días distintos
    window.eemTipoVisita = tipo;
    if (tipo !== 'real') {
      var pf = tipo === 'bot' ? 'tb' : 'tp';
      hit(pf + '-total'); hit(pf + '-' + ymd);
    } else {
      var k = 'v-' + ymd;
      var pag = (location.pathname.split('/').pop().replace('.html', '') || 'inicio').slice(0, 24).replace(/[^a-z0-9-]/gi, '');
      // 7 peticiones por visita real: abacus limita ~30 por 10 s y por IP, y en redes móviles compartidas se perdían contadores
      var slug = location.pathname.split('/').pop().replace('.html', ''), hh = 5381, ci;
      for (ci = 0; ci < slug.length; ci++) hh = ((hh << 5) + hh + slug.charCodeAt(ci)) >>> 0;
      hit('v-total'); hit(k);
      hit(/^\/(notas|artistas)\//.test(location.pathname) ? 'n-' + ('00000000' + hh.toString(16)).slice(-8) : 'p-' + pag);       // por nota (hash del slug) o por sección
      hit('h-' + new Date().toISOString().slice(0, 13).replace(/[-T]/g, ''));      // visitas por hora (UTC)
      var ref = (document.referrer || '').toLowerCase(), q = new URLSearchParams(location.search);
      var o = ref.indexOf(location.hostname) > -1 ? 'interna' : !ref ? 'directo' : /google\./.test(ref) ? 'google' : /bing\.|duckduckgo|yahoo|ecosia|brave/.test(ref) ? 'buscadores' :
        /facebook|fb\.|l\.facebook/.test(ref) ? 'facebook' : /instagram/.test(ref) ? 'instagram' : /tiktok/.test(ref) ? 'tiktok' : /youtube|youtu\.be/.test(ref) ? 'youtube' :
        /t\.me|telegram/.test(ref) ? 'telegram' : /twitter|x\.com|t\.co/.test(ref) ? 'x' : /whatsapp|wa\.me/.test(ref) ? 'whatsapp' : /bsky\.app|bluesky/.test(ref) ? 'bluesky' : /threads/.test(ref) ? 'threads' : 'otro';
      if (q.get('utm_source')) o = q.get('utm_source').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || o;
      if (o !== 'interna') hit('o-' + o);          // de dónde llegan
      hit('d-' + (/Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'movil' : 'escritorio'));
      if (!localStorage.eem_v) { localStorage.eem_v = '1'; hit('u-nuevos'); } else { hit('u-recurrentes'); }   // visitantes nuevos vs. que regresan
      // [.leon 2026-11-17] Contador mejorado (copiado del de OKpolítico): por día, sesiones, calidad de lectura, geografía, referidos y clics.
      try {
        var dk = ymd, mov = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || ''), mes = ymd.slice(0, 6);
        if (o !== 'interna') hit('o-' + o + '-' + dk);                                            // origen por día
        if (localStorage.eem_d !== dk) { localStorage.eem_d = dk; hit('u-' + dk); }               // visitantes únicos del día
        if (!sessionStorage.eem_s) { sessionStorage.eem_s = '1'; hit('s-' + dk); hit((localStorage.eem_vv ? 'ur-' : 'un-') + dk); localStorage.eem_vv = '1'; hit((mov ? 'dm-' : 'de-') + dk); }   // sesiones, nuevos/recurrentes y dispositivo por día
        if (o === 'directo') { hit('od-' + pag); hit((mov ? 'odm-' : 'ode-') + dk); }              // directos por página y dispositivo
        if (o === 'otro' && ref) {
          var rh = (ref.split('/')[2] || '').replace(/^www\./, ''), rn = /news\.google|discover/.test(rh) ? 'gnoticias' : /chatgpt|openai/.test(rh) ? 'chatgpt' : /perplexity/.test(rh) ? 'perplexity' : /reddit/.test(rh) ? 'reddit' :
            /linkedin|lnkd/.test(rh) ? 'linkedin' : /pinterest/.test(rh) ? 'pinterest' : /msn\.|bing/.test(rh) ? 'msn' : /mail\.|outlook|gmail/.test(rh) ? 'correo' : /brave|ecosia|qwant|yandex|baidu|naver/.test(rh) ? 'otros-buscadores' :
            /feedly|flipboard|inoreader/.test(rh) ? 'lectores-rss' : /gemini|claude\.ai|copilot/.test(rh) ? 'ia' : 'otros';
          hit('rf-' + rn + '-' + dk);                                                              // referidos conocidos
        }
        var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
        if (!sessionStorage.eem_geo) { sessionStorage.eem_geo = '1'; hit(/^America\/(Mexico_City|Monterrey|Merida|Cancun|Chihuahua|Hermosillo|Mazatlan|Tijuana|Matamoros|Ojinaga|Bahia_Banderas|Ciudad_Juarez)/.test(tz) ? 'geo-mx-' + dk : /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Detroit|Anchorage|Boise|Indiana|Kentucky|North_Dakota|Menominee|Juneau|Sitka|Nome|Yakutat)|^Pacific\/Honolulu/.test(tz) ? 'geo-us2-' + dk : 'geo-otro-' + dk); }   // México vs EE. UU. vs resto
        var vis = 0, tmr = setInterval(function () {                                                // calidad: segundos con la página visible
          if (document.visibilityState === 'visible') { vis++; if (vis === 10) { hit('e10-' + dk); if (o === 'directo') hit('od10-' + dk); } if (vis === 30) hit('e30-' + dk); if (vis === 90) { hit('e90-' + dk); clearInterval(tmr); } }
        }, 1000);
        var s50 = 0, s90 = 0;
        addEventListener('scroll', function () {                                                    // calidad: hasta dónde se lee
          var m = (scrollY + innerHeight) / Math.max(1, document.documentElement.scrollHeight);
          if (!s50 && m > .5) { s50 = 1; hit('sc50-' + dk); } if (!s90 && m > .9) { s90 = 1; hit('sc90-' + dk); if (o === 'directo') hit('od90-' + dk); }
        }, { passive: true });
        try { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { hit('adi-' + String(x.target.dataset.ad).replace(/[^a-z0-9-]/gi, '').slice(0, 30) + '-' + mes); io.unobserve(x.target); } }); }, { threshold: .5 });
          setTimeout(function () { document.querySelectorAll('[data-ad]').forEach(function (n) { io.observe(n); }); }, 2500); } catch (e) { }   // anuncios vistos (los anuncios se pintan después de cargar data/anuncios.json)
        document.addEventListener('click', function (e) {                                           // clics: anuncios por mes, compartir, Telegram y redes
          var a = e.target.closest && e.target.closest('a'); if (!a) return; var u = a.href || '';
          if (a.dataset.ad) hit('adc-' + String(a.dataset.ad).replace(/[^a-z0-9-]/gi, '').slice(0, 30) + '-' + mes);
          if (a.closest('.compartir,.wa-top')) { hit('comp-' + (/wa\.me/.test(u) ? 'whatsapp' : /t\.me/.test(u) ? 'telegram' : /facebook/.test(u) ? 'facebook' : 'x')); return; }
          var rd = u.match(/(youtube|tiktok|instagram|facebook)\.com/); if (rd) hit('red-' + rd[1]); else if (u.indexOf('t.me/') > -1) hit('tg-' + (a.dataset.f || pag).slice(0, 20));
        }, true);
      } catch (e) { }
    }
  } catch (e) { }
  // [e.leo] El espacio de AdSense NO se muestra hasta que Google entrega un anuncio (data-ad-status="filled"); el resultado de las visitas reales
  // se cuenta (adsense-filled / adsense-vacio) y el Director de Operaciones lo lee para avisar cuando Google active la señal.
  function senal(el) {
    var ins = el.querySelector('ins.adsbygoogle'); if (!ins) return;
    var visto = false;
    var listo = function () {
      var st = ins.getAttribute('data-ad-status');
      if (!st || visto) return;
      visto = true;
      if (st === 'filled') { el.classList.add('listo'); if (window.eemTipoVisita === 'real') hit('adsense-filled'); }
      else if (window.eemTipoVisita === 'real') hit('adsense-vacio');
    };
    try { new MutationObserver(listo).observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] }); } catch (e) { }
    setTimeout(listo, 8000);
  }
  var slots = document.querySelectorAll('[data-slot]'); if (!slots.length) return;
  fetch('/data/anuncios.json?_=' + Date.now()).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (ads) {
    slots.forEach(function (el) {
      var pos = el.dataset.slot, a = ads[pos];
      if (a && (a.html || a.img)) {
        el.className = 'ad';
        el.innerHTML = '<span>Publicidad</span>' + (a.html || '<a href="' + esc(a.url) + '" rel="sponsored noopener" target="_blank" data-ad="' + esc(pos) + '"><img src="' + esc(a.img) + '" alt="' + esc(a.marca || '') + '" loading="lazy"></a>');
      } else if ((ads._adsense || {})[pos] && !/chisme|misterio|terror|fallece|murio|muerte/i.test(location.pathname)) {   // brand-safety: sin AdSense en chisme/terror/muertes            // [e.leo] sin anunciante directo → unidad de AdSense (pega el ID de bloque en data/anuncios.json → "_adsense": {"cabecera": "1234567890"})
        el.className = 'ad adsense';
        el.innerHTML = '<span>Publicidad</span><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5230441592261869" data-ad-slot="' + esc(ads._adsense[pos]) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
        senal(el);
      } else if (pos !== 'cabecera' && pos !== 'nota') {   // [e.leo] ranuras extra: solo se muestran con anunciante directo o bloque de AdSense
        el.style.display = 'none';
      } else {
        el.style.display = 'none';
      }
    });
  });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-ad]'); if (a) hit('ad-' + a.dataset.ad.replace(/[^a-z0-9-]/gi, '').slice(0, 30)); }, true);
})();
