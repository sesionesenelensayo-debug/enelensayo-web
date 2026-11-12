// [.leon 2026-11-03] Botones de compartir con iconos de colores (X, Facebook, WhatsApp, Instagram Historia, Bluesky, Threads, Telegram, copiar). Historia de IG = imagen 1080×1920 generada en el navegador.
(function () {
  var box = document.querySelector('.share'); if (!box) return;
  var url = location.href.split('#')[0], titulo = (document.querySelector('h1') || {}).textContent || document.title, u = encodeURIComponent(url), t = encodeURIComponent(titulo);
  var B = [
    ['x', 'X', '#111111', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
    ['facebook', 'Facebook', '#1877F2', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
    ['whatsapp', 'WhatsApp', '#25D366', 'https://wa.me/?text=' + t + '%20' + u],
    ['instagram', 'Historia IG', '#E1306C', '#historia'],
    ['bluesky', 'Bluesky', '#0085FF', 'https://bsky.app/intent/compose?text=' + t + '%20' + u],
    ['threads', 'Threads', '#000000', 'https://www.threads.net/intent/post?text=' + t + '%20' + u],
    ['telegram', 'Telegram', '#26A5E4', 'https://t.me/share/url?url=' + u + '&text=' + t]
  ];
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
    box.appendChild(a);
  });
  var cp = document.createElement('a'); cp.className = 'cp'; cp.href = '#'; cp.innerHTML = '<i style="--m:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z%22/></svg>\')"></i>Copiar enlace';
  cp.addEventListener('click', function (e) { e.preventDefault(); try { navigator.clipboard.writeText(url); } catch (x) { } cp.lastChild.textContent = '¡Copiado!'; setTimeout(function () { cp.lastChild.textContent = 'Copiar enlace'; }, 1800); });
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
