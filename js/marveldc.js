(function () {
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fecha(f) { var m = String(f || '').match(/(\d{4})-(\d\d)-(\d\d)/); return m ? m[3] + '/' + m[2] : ''; }
  var op = document.getElementById('mdOpinion'), ma = document.getElementById('mdMarvel'), dc = document.getElementById('mdDC');
  if (!op && !ma && !dc) return;
  var DC = /\b(dc|dcu|gunn|safran|superman|supergirl|batman|clayface|lanterns|peacemaker|creature commandos|joker|wonder woman|aquaman|flash)\b/i;
  function card(a, tag) {
    return '<a class="sx-card" href="' + esc(a.url) + '"><div class="foto">' + (a.imagen_url ? '<img loading="lazy" src="' + esc(a.imagen_url) + '" alt="" onerror="this.remove()">' : '') + '</div><div class="cuerpo"><span class="sx-tag">' + tag + '</span><h3>' +
      esc(a.titulo) + '</h3><span class="sx-meta"><b>' + esc(a.artista || '') + '</b><span>' + fecha(a.fecha) + '</span></span></div></a>';
  }
  fetch('data/articles.json?x=' + Date.now()).then(function (r) { return r.json(); }).then(function (arts) {
    var l = arts.filter(function (a) { return (a.categoria || '') === 'Marvel y DCU'; }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    var opin = l.filter(function (a) { return a.opinion; }), res = l.filter(function (a) { return !a.opinion; });
    if (op) { if (opin.length) op.innerHTML = opin.slice(0, 6).map(function (a) { return card(a, 'Opinión'); }).join(''); else { op.previousElementSibling.remove(); op.remove(); } }
    var d = res.filter(function (a) { return DC.test((a.titulo || '') + ' ' + (a.artista || '')); }), m = res.filter(function (a) { return d.indexOf(a) < 0; });
    if (ma && m.length) ma.innerHTML = m.slice(0, 9).map(function (a) { return card(a, 'Marvel'); }).join('');
    if (dc && d.length) dc.innerHTML = d.slice(0, 9).map(function (a) { return card(a, 'DCU'); }).join('');
  }).catch(function () { });
})();
