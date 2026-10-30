// Suscripción al newsletter por correo: el formulario manda el correo al Worker de Cloudflare (gratuito) y el bot lo recoge para los envíos
(function () {
  var f = document.getElementById('nlForm'); if (!f) return;
  var API = 'https://eeem-newsletter.enelensayomedia.workers.dev';
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var m = document.getElementById('nlMsg'), b = f.querySelector('button'), e = f.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e)) { m.textContent = 'Escribe un correo válido.'; return; }
    if (!f.acepto.checked) { m.textContent = 'Marca que aceptas el aviso de privacidad.'; return; }
    b.disabled = true; m.textContent = 'Enviando…';
    fetch(API + '/suscribir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, acepto: true, web: f.web.value }) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        if (j.ok) { f.innerHTML = '<div class="nlok">✅ ¡Listo! Te suscribiste. Recibirás El Periódico en tu correo de lunes a viernes; si no lo ves, revisa Spam o Promociones.</div>'; }
        else { b.disabled = false; m.textContent = j.error === 'limite' ? 'Demasiados intentos; prueba en una hora.' : 'No se pudo. Revisa tu correo e inténtalo de nuevo.'; }
      })
      .catch(function () { b.disabled = false; m.textContent = 'Sin conexión. Inténtalo de nuevo.'; });
  });
})();
