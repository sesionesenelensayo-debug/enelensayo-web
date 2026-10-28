// Pestaña Podcast: todos los videos del canal @EnelEnsayo (data/podcast.json), con buscador y reproductor en la misma página
(function () {
  var g = document.getElementById('podGrid'); if (!g) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var dur = function (s) { if (!s) return ''; var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  var TODOS = [], N = 24, Q = '';
  var norm = function (t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  function pinta() {
    var l = TODOS.filter(function (v) { return !Q || norm(v.t).indexOf(Q) >= 0; });
    document.getElementById('podCuenta').textContent = l.length + ' videos';
    g.innerHTML = l.slice(0, N).map(function (v) {
      return '<button class="pod-card" data-id="' + esc(v.id) + '"><span class="pod-th"><img loading="lazy" src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt=""><i>▶</i>' +
        (v.d ? '<em>' + dur(v.d) + '</em>' : '') + '</span><span class="pod-t">' + esc(v.t) + '</span><small>' + esc(v.tipo) + '</small></button>';
    }).join('') || '<p class="sx-vacio">Sin resultados.</p>';
    document.getElementById('podMas').hidden = N >= l.length;
  }
  g.addEventListener('click', function (e) {
    var b = e.target.closest('.pod-card'); if (!b) return;
    var v = document.getElementById('podVisor'); v.hidden = false;
    v.innerHTML = '<div class="pod-video"><iframe src="https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
    v.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  document.getElementById('podMas').onclick = function () { N += 24; pinta(); };
  document.getElementById('podBuscar').oninput = function () { Q = norm(this.value.trim()); N = 24; pinta(); };
  fetch('data/podcast.json?_=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) { TODOS = d.videos || []; pinta(); }).catch(function () { g.innerHTML = '<p class="sx-vacio">No se pudo cargar. <a href="https://www.youtube.com/@EnelEnsayo">Ver en YouTube</a></p>'; });
})();
