// Cuentas regresivas (fechas en data/cuentas.json)
(function () {
  fetch('data/cuentas.json?_=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
    var els = document.querySelectorAll('[data-cuenta]');
    function pintar() {
      els.forEach(function (el) {
        var c = d[el.getAttribute('data-cuenta')]; if (!c) return;
        el.querySelector('.cuenta-n').textContent = c.titulo + ' · ' + new Date(c.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
        var ms = new Date(c.fecha + 'T00:00:00-06:00') - new Date(), r = el.querySelector('.cuenta-r');
        if (ms <= 0) { r.innerHTML = '<b>¡Ya llegó!</b>'; return; }
        var v = [[Math.floor(ms / 864e5), 'días'], [Math.floor(ms / 36e5) % 24, 'horas'], [Math.floor(ms / 6e4) % 60, 'min'], [Math.floor(ms / 1e3) % 60, 'seg']];
        r.innerHTML = v.map(function (x) { return '<div><b>' + x[0] + '</b><small>' + x[1] + '</small></div>'; }).join('');
      });
    }
    pintar(); setInterval(pintar, 1000);
  }).catch(function () { });
})();
