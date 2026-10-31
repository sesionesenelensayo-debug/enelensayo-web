// Publicidad del portal (método de OKpolítico): espacios «cabecera» y «nota»; vendido → anuncio rotulado «Publicidad»;
// libre → invitación a anunciarse. Más un contador de visitas anónimo (sin datos personales) para medir la audiencia.
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var A = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx/';
  function hit(k) { try { fetch(A + k, { mode: 'no-cors', keepalive: true }); } catch (e) { } }
  try {
    if (/[?&]yo=1/.test(location.search)) localStorage.eem_yo = '1';
    if (/[?&]yo=0/.test(location.search)) localStorage.removeItem('eem_yo');
    if (!localStorage.eem_yo) {
      var d = new Date(), k = 'v-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
      var pag = (location.pathname.split('/').pop().replace('.html', '') || 'inicio').slice(0, 24).replace(/[^a-z0-9-]/gi, '');
      hit('v-total'); hit(k); hit('p-' + pag);
      var ref = (document.referrer || '').toLowerCase(), q = new URLSearchParams(location.search);
      var o = ref.indexOf(location.hostname) > -1 ? 'interna' : !ref ? 'directo' : /google\./.test(ref) ? 'google' : /bing\.|duckduckgo|yahoo|ecosia|brave/.test(ref) ? 'buscadores' :
        /facebook|fb\.|l\.facebook/.test(ref) ? 'facebook' : /instagram/.test(ref) ? 'instagram' : /tiktok/.test(ref) ? 'tiktok' : /youtube|youtu\.be/.test(ref) ? 'youtube' :
        /t\.me|telegram/.test(ref) ? 'telegram' : /twitter|x\.com|t\.co/.test(ref) ? 'x' : /whatsapp|wa\.me/.test(ref) ? 'whatsapp' : /threads/.test(ref) ? 'threads' : 'otro';
      if (q.get('utm_source')) o = q.get('utm_source').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || o;
      if (o !== 'interna') { hit('o-' + o); hit('o-' + o + '-' + k.slice(2)); }          // de dónde llegan
      var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
      if (tz) hit('z-' + tz.replace(/[^A-Za-z0-9]/g, '_').slice(0, 40));                // región aproximada (zona horaria del navegador; no se guarda la IP)
      hit('d-' + (/Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'movil' : 'escritorio'));
      try { if (!sessionStorage.eem_s) { sessionStorage.eem_s = '1'; hit('s-total'); } } catch (e) { }
      if (!localStorage.eem_v) { localStorage.eem_v = '1'; hit('u-nuevos'); } else { hit('u-recurrentes'); }   // visitantes nuevos vs. que regresan
    }
  } catch (e) { }
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
      } else if (pos !== 'cabecera' && pos !== 'nota') {   // [e.leo] ranuras extra: solo se muestran con anunciante directo o bloque de AdSense
        el.style.display = 'none';
      } else {
        el.className = 'ad libre';
        el.innerHTML = '<a href="/anunciate.html" data-ad="libre-' + esc(pos) + '">Anúnciate aquí desde $49 MXN · tu negocio frente a lectores de música de México →</a>';
      }
    });
  });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-ad]'); if (a) hit('ad-' + a.dataset.ad.replace(/[^a-z0-9-]/gi, '').slice(0, 30)); }, true);
})();
