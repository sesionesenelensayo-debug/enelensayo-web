// [.leon 2026-11-03] Botones de compartir con iconos de colores (X, Facebook, WhatsApp, Instagram Historia, Bluesky, Threads, Telegram, copiar). Historia de IG = imagen 1080×1920 generada en el navegador.
(function () {
  var box = document.querySelector('.share'); if (!box) return;
  var url = location.href.split('#')[0], titulo = (document.querySelector('h1') || {}).textContent || document.title, u = encodeURIComponent(url), t = encodeURIComponent(titulo);
  // [.leon 2026-11-12] Cada clic en compartir se cuenta (sh-total, sh-<red>, sh-n-<nota>) y el enlace compartido lleva utm_source=<red>: así se mide quién comparte y de dónde vuelve el tráfico (WhatsApp/Telegram no envían referrer).
  var base = location.origin + location.pathname;
  function U(red) { return encodeURIComponent(base + '?utm_source=' + red + '&utm_medium=compartido'); }
  var B = [
    ['x', 'X', '#111111', 'https://twitter.com/intent/tweet?url=' + U('x') + '&text=' + t],
    ['facebook', 'Facebook', '#1877F2', 'https://www.facebook.com/sharer/sharer.php?u=' + U('facebook')],
    ['whatsapp', 'WhatsApp', '#25D366', 'https://wa.me/?text=' + t + '%20' + U('whatsapp')],
    ['instagram', 'Historia IG', '#E1306C', '#historia'],
    ['bluesky', 'Bluesky', '#0085FF', 'https://bsky.app/intent/compose?text=' + t + '%20' + U('bluesky')],
    ['threads', 'Threads', '#000000', 'https://www.threads.net/intent/post?text=' + t + '%20' + U('threads')],
    ['telegram', 'Telegram', '#26A5E4', 'https://t.me/share/url?url=' + U('telegram') + '&text=' + t]
  ];
  function contar(red) {
    try {
      if (window.eemTipoVisita !== 'real') return;
      var slug = location.pathname.split('/').pop().replace('.html', ''), hh = 5381, i, A = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx2/';
      for (i = 0; i < slug.length; i++) hh = ((hh << 5) + hh + slug.charCodeAt(i)) >>> 0;
      ['sh-total', 'sh-' + red, 'sh-n-' + ('00000000' + hh.toString(16)).slice(-8)].forEach(function (k) { fetch(A + k, { mode: 'no-cors', keepalive: true }); });
    } catch (e) { }
  }

  var st = document.createElement('style');
  st.textContent = '.share.cmp{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.share.cmp>span{font:400 12px ui-monospace,monospace;text-transform:uppercase;margin-right:2px}' +
    '.share.cmp a{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:99px;padding:8px 14px 8px 10px;color:#fff;font:800 13px/1 Manrope,system-ui,sans-serif;text-transform:none;letter-spacing:0;text-decoration:none;cursor:pointer;transition:transform .15s,filter .15s}' +
    '.share.cmp a:hover{transform:translateY(-2px);filter:brightness(1.12);background:var(--c)}.share.cmp a i{width:20px;height:20px;display:inline-block;background:#fff;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}' +
    '.share.cmp a.ig{background:linear-gradient(45deg,#F9CE34,#EE2A7B 50%,#6228D7)}.share.cmp a.cp{background:#4b3fd1}.share.cmp a:not(.ig):not(.cp){background:var(--c)}';
  document.head.appendChild(st);
  box.className += ' cmp'; box.innerHTML = '<span>Compartir:</span>';
  B.forEach(function (b) {
    var a = document.createElement('a'); a.style.setProperty('--c', b[2]); a.setAttribute('aria-label', 'Compartir en ' + b[1]);
    a.innerHTML = '<i style="--m:url(/img/iconos/' + b[0] + '.svg)"></i>' + b[1];
    if (b[3] === '#historia') { a.className = 'ig'; a.href = '#'; a.addEventListener('click', function (e) { e.preventDefault(); historia(a); }); }
    else { a.href = b[3]; a.target = '_blank'; a.rel = 'noopener'; }
    a.addEventListener('click', function () { contar(b[0]); });
    box.appendChild(a);
  });
  var cp = document.createElement('a'); cp.className = 'cp'; cp.href = '#'; cp.innerHTML = '<i style="--m:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z%22/></svg>\')"></i>Copiar enlace';
  cp.addEventListener('click', function (e) { e.preventDefault(); contar('copiar'); try { navigator.clipboard.writeText(base + '?utm_source=copiado&utm_medium=compartido'); } catch (x) { } cp.lastChild.textContent = '¡Copiado!'; setTimeout(function () { cp.lastChild.textContent = 'Copiar enlace'; }, 1800); });
  box.appendChild(cp);

  function envolver(c, texto, x, y, ancho, alto, max) {
    var pal = texto.split(' '), l = '', ls = [];
    pal.forEach(function (w) { var p = l ? l + ' ' + w : w; if (c.measureText(p).width > ancho && l) { ls.push(l); l = w; } else l = p; });
    ls.push(l); ls = ls.slice(0, max); if (ls.length === max && pal.join(' ').length > ls.join(' ').length) ls[max - 1] = ls[max - 1].replace(/\s*\S*$/, '…');
    ls.forEach(function (s, i) { c.fillText(s, x, y + i * alto); }); return y + ls.length * alto;
  }
  function historia(btn) {
    var src = (document.querySelector('figure.hero img') || document.querySelector('article img') || {}).src || '', im = new Image(); im.crossOrigin = 'anonymous';
    var etiqueta = btn.lastChild; var ant = etiqueta.textContent; etiqueta.textContent = 'Preparando…';
    var pintar = function (img) {
      var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var c = cv.getContext('2d');
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0812'); g.addColorStop(1, '#2a1650'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = '#ffe53b'; c.font = '800 44px Manrope,Arial,sans-serif'; c.fillText('EN EL ENSAYO MEDIA', 60, 120);
      // [.leon 2026-11-04] La portada ya trae su texto: se dibuja COMPLETA (sin recortar). Ancho 960 y alto proporcional (tope 980).
      var ih = 0;
      if (img) { var r = Math.min(960 / img.width, 980 / img.height), w = img.width * r, h = img.height * r; ih = h; var x0 = 60 + (960 - w) / 2; c.save(); c.beginPath(); c.roundRect ? c.roundRect(x0, 170, w, h, 36) : c.rect(x0, 170, w, h); c.clip(); c.drawImage(img, x0, 170, w, h); c.restore(); }
      c.fillStyle = '#fff'; c.font = '900 68px Manrope,Arial,sans-serif'; var y = envolver(c, titulo.trim(), 60, 170 + (ih || 800) + 100, 960, 82, 5);
      c.fillStyle = '#ffe53b'; var by = Math.max(y + 50, 1560); c.beginPath(); c.roundRect ? c.roundRect(60, by, 960, 110, 55) : c.rect(60, by, 960, 110); c.fill();
      c.fillStyle = '#0b0812'; c.font = '800 44px Manrope,Arial,sans-serif'; c.textAlign = 'center'; c.fillText('LEE LA NOTA · enelensayomedia.com', 540, by + 70); c.textAlign = 'left';
      cv.toBlob(function (blob) {
        etiqueta.textContent = ant; if (!blob) { alert('No pude preparar la imagen. Intenta de nuevo.'); return; }
        var f = new File([blob], 'historia-eem.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: titulo, url: url }).catch(function () { }); }
        else { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'historia-eem.png'; a.click(); try { navigator.clipboard.writeText(url); } catch (x) { } alert('Descargué la imagen. Súbela a tu historia de Instagram y pega el enlace (ya lo copié) con el sticker «Enlace».'); }
      }, 'image/png');
    };
    im.onload = function () { pintar(im); }; im.onerror = function () { pintar(null); }; if (src) im.src = src; else pintar(null);
  }
})();

// [.leon 2026-11-12] Mejoras de retención (solo páginas de nota): (1) cuadro «Entérate primero» al canal de Telegram con contador de clics (tg-nota); (2) «Lo más leído» de la categoría (data/mas_leidas.json, lo genera el bot con los contadores de visitas).
(function () {
  var box = document.querySelector('.share'); var art = document.querySelector('article'); if (!box || !art) return;
  var A = 'https://abacus.jasoncameron.dev/hit/enelensayo-mx2/';
  var st = document.createElement('style');
  st.textContent = '.eem-tg{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:26px 0 8px;padding:16px 18px;border-radius:16px;background:linear-gradient(135deg,#26A5E4,#1b6fb3);color:#fff}' +
    '.eem-tg b{flex:1 1 200px;font:800 16px/1.25 Manrope,system-ui,sans-serif}.eem-tg a{background:#fff;color:#0b4f82;font:800 14px Manrope,system-ui,sans-serif;padding:10px 16px;border-radius:99px;text-decoration:none}' +
    '.eem-mas{margin:22px 0 8px}.eem-mas h3{font:800 15px Manrope,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;margin:0 0 10px}.eem-mas a{display:block;padding:10px 0;border-top:1px solid rgba(128,128,150,.3);text-decoration:none;color:inherit;font:700 15px/1.3 Manrope,system-ui,sans-serif}.eem-mas small{display:block;font:400 11px ui-monospace,monospace;opacity:.7;margin-top:2px}';
  document.head.appendChild(st);
  var tg = document.createElement('div'); tg.className = 'eem-tg';
  tg.innerHTML = '<b>📲 Entérate primero: lo último de En el Ensayo en nuestro canal de Telegram</b><a href="https://t.me/enelensayomedia" target="_blank" rel="noopener">Unirme gratis</a>';
  tg.querySelector('a').addEventListener('click', function () { try { if (window.eemTipoVisita === 'real') fetch(A + 'tg-nota', { mode: 'no-cors', keepalive: true }); } catch (e) { } });
  box.parentNode.insertBefore(tg, box.nextSibling);
  var propia = location.pathname.split('/').pop(), cat = ((document.querySelector('.kicker') || {}).textContent || '').split('·').pop().trim().toLowerCase();
  fetch('/data/mas_leidas.json?_=' + Math.floor(Date.now() / 3600000)).then(function (r) { return r.json(); }).then(function (d) {
    var L = (d.categorias && d.categorias[cat]) || []; L = L.filter(function (n) { return n.url.indexOf(propia) < 0; });
    var titulo = 'Lo más leído en ' + (cat ? cat.replace(/^./, function (c) { return c.toUpperCase(); }) : 'la semana');
    if (L.length < 2) { L = (d.general || []).filter(function (n) { return n.url.indexOf(propia) < 0; }); titulo = 'Lo más leído esta semana'; }
    if (!L.length) return;
    var m = document.createElement('div'); m.className = 'eem-mas'; m.innerHTML = '<h3>' + titulo + '</h3>' + L.slice(0, 4).map(function (n) {
      return '<a href="' + n.url + '?utm_source=interna&utm_medium=mas_leidas">' + n.titulo.replace(/</g, '&lt;') + '<small>' + n.visitas + ' lecturas</small></a>';
    }).join('');
    tg.parentNode.insertBefore(m, tg.nextSibling);
  }).catch(function () { });
})();
