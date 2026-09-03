/* ============================================
   EN EL ENSAYO MEDIA — main.js
   Carga artículos desde data/articles.json
   (generado automáticamente por el bot)
   ============================================ */

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('navBurger');
const mobileM = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});
burger?.addEventListener('click', () => {
  mobileM.classList.toggle('open');
});

// ── Formatear fecha relativa ──────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d    = new Date(dateStr);
    const diff = (Date.now() - d) / 1000 / 60; // minutos
    if (diff < 60)   return `Hace ${Math.round(diff)} min`;
    if (diff < 1440) return `Hace ${Math.round(diff / 60)} h`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

// ── Renderizar tarjeta de artículo ───────────────────────────────────────────
function renderCard(art) {
  const tag      = art.tipo === 'entrevista' ? 'Entrevista'
                 : art.tipo === 'reportaje'  ? 'Reportaje'
                 : 'Noticia';
  const tagClass = art.tipo === 'entrevista' ? 'article-tag--entrevista'
                 : art.tipo === 'reportaje'  ? 'article-tag--reportaje'
                 : '';
  const imgHtml  = art.imagen_url
    ? `<img class="article-img" src="${art.imagen_url}" alt="${art.titulo}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=\\'article-img-placeholder\\'>🎵</div>'">`
    : `<div class="article-img-placeholder">🎵</div>`;

  return `
    <article class="article-card">
      ${imgHtml}
      <div class="article-body">
        <span class="article-tag ${tagClass}">${tag}</span>
        <h3 class="article-title">${art.titulo}</h3>
        <p class="article-excerpt">${art.intro ? art.intro.slice(0, 120) + '...' : ''}</p>
        <div class="article-footer">
          <span class="article-date">${formatDate(art.fecha)}</span>
          <a class="article-link" href="${art.telegraph_url || '#'}" target="_blank" rel="noopener">
            Leer →
          </a>
        </div>
      </div>
    </article>`;
}

// ── Renderizar featured card (reportajes) ─────────────────────────────────────
function renderFeatured(art) {
  return `
    <div class="featured-card">
      <div class="featured-card-text">
        <span class="featured-card-tag">📰 Reportaje exclusivo</span>
        <h3 class="featured-card-title">${art.titulo}</h3>
        <p class="featured-card-excerpt">${art.intro ? art.intro.slice(0, 160) + '...' : ''}</p>
      </div>
      <a class="featured-card-link" href="${art.telegraph_url || '#'}" target="_blank" rel="noopener">
        Leer reportaje →
      </a>
    </div>`;
}

// ── Cargar y renderizar artículos ─────────────────────────────────────────────
async function cargarArticulos() {
  let articulos = [];

  try {
    const res = await fetch(`data/articles.json?_=${Date.now()}`);
    if (res.ok) {
      articulos = await res.json();
    }
  } catch (_) {
    // Sin artículos publicados aún — mostrar placeholder
  }

  // Actualizar stat de artículos
  const statEl = document.getElementById('statArticulos');
  if (statEl) statEl.textContent = articulos.length || '0';

  const noticias     = articulos.filter(a => a.tipo !== 'entrevista').slice(0, 6);
  const entrevistas  = articulos.filter(a => a.tipo === 'entrevista').slice(0, 4);
  const reportajes   = articulos.filter(a => a.tipo === 'reportaje').slice(0, 3);

  // ── Grid principal de noticias ──
  const grid = document.getElementById('articlesGrid');
  if (grid) {
    if (noticias.length) {
      grid.innerHTML = noticias.map(renderCard).join('');
    } else {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">
          <p style="font-size:2rem;margin-bottom:1rem">📡</p>
          <p style="font-weight:700;margin-bottom:0.5rem">Escáner activo</p>
          <p style="font-size:0.9rem">El primer reportaje se publicará automáticamente a las 12:00pm CDMX.</p>
        </div>`;
    }
  }

  // ── Reportajes featured ──
  const featuredEl = document.getElementById('reportajesFeatured');
  if (featuredEl) {
    if (reportajes.length) {
      featuredEl.innerHTML = reportajes.map(renderFeatured).join('');
    } else {
      featuredEl.innerHTML = `
        <div class="featured-card" style="opacity:0.5">
          <div class="featured-card-text">
            <span class="featured-card-tag">📰 Próximamente</span>
            <h3 class="featured-card-title">Los primeros reportajes están en camino</h3>
            <p class="featured-card-excerpt">
              Usa <code style="background:var(--black);padding:2px 6px;border-radius:4px">/reportaje [tema]</code>
              en Telegram para publicar el primero.
            </p>
          </div>
        </div>`;
    }
  }

  // ── Entrevistas ──
  const entrevistasEl = document.getElementById('entrevistasGrid');
  if (entrevistasEl) {
    if (entrevistas.length) {
      entrevistasEl.innerHTML = entrevistas.map(renderCard).join('');
    } else {
      entrevistasEl.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray)">
          <p style="font-size:2rem;margin-bottom:0.75rem">🎤</p>
          <p style="font-weight:700;margin-bottom:0.5rem">Entrevistas en preparación</p>
          <p style="font-size:0.9rem">Usa <code style="background:var(--black-2);padding:2px 6px;border-radius:4px">/entrevista [artista]</code> en el bot.</p>
        </div>`;
    }
  }
}

// ── Intersection Observer para animaciones ───────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function initAnimations() {
  document.querySelectorAll(
    '.section-header, .article-card, .featured-card, .about-card, ' +
    '.social-band, .short-card, .long-card, .podcast-card'
  ).forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Cargar stats de redes sociales ────────────────────────────────────────────
async function cargarStats() {
  try {
    const res = await fetch(`data/stats.json?_=${Date.now()}`);
    if (!res.ok) return;
    const stats = await res.json();

    const map = {
      'cntYtSubs':   ['yt_subs',          'Suscriptores'],
      'cntYtShorts': ['yt_views_shorts',  'Reproducciones Shorts'],
      'cntIg':       ['ig_seguidores',    'Seguidores IG'],
      'cntX':        ['x_seguidores',     'Seguidores X'],
      'cntTg':       ['telegram_miembros','Miembros TG'],
      'cntFb':       ['fb_fans',          'Fans FB'],
    };

    Object.entries(map).forEach(([elId, [key]]) => {
      const el  = document.getElementById(elId);
      const val = stats[key] || 0;
      if (el && val > 0) animateCounter(el, val);
      // If val is 0, leave the "—" default in place
    });

    const updEl = document.getElementById('statsUpdated');
    if (updEl && stats.updated) updEl.textContent = `Actualizado: ${stats.updated}`;
  } catch (_) {}
}

// ── Animate counter from 0 to target ─────────────────────────────────────────
function animateCounter(el, target) {
  const duration = 1800;
  const start    = performance.now();
  const update   = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.round(eased * target);
    el.textContent = current >= 1000
      ? (current >= 1_000_000
          ? (current / 1_000_000).toFixed(1) + 'M'
          : (current / 1000).toFixed(1) + 'K')
      : current;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Init counters with IntersectionObserver ───────────────────────────────────
function initCounters() {
  const band = document.getElementById('comunidad');
  if (!band) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { cargarStats(); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(band);
}

// ── Cargar videos (shorts, longs, podcast) ────────────────────────────────────
async function cargarVideos() {
  let videos = { shorts: [], longs: [], podcast: [] };
  try {
    const res = await fetch(`data/videos.json?_=${Date.now()}`);
    if (res.ok) videos = await res.json();
  } catch (_) {}

  renderShorts(videos.shorts  || []);
  renderLongs(videos.longs    || []);
  renderPodcast(videos.podcast || []);
}

// ── Render shorts carousel ────────────────────────────────────────────────────
function renderShorts(shorts) {
  const track = document.getElementById('shortsTrack');
  if (!track) return;
  if (!shorts.length) {
    const section = track.closest('.shorts-carousel-section');
    if (section) {
      const emptyEl = section.querySelector('.shorts-empty');
      if (emptyEl) emptyEl.style.display = 'flex';
    }
    track.style.display = 'none';
    document.querySelectorAll('.carousel-btn').forEach(b => b.style.display = 'none');
    return;
  }
  track.innerHTML = shorts.map(s => `
    <a class="short-card" href="https://www.youtube.com/shorts/${s.id}" target="_blank" rel="noopener">
      <div class="short-card-thumb">
        <img src="https://img.youtube.com/vi/${s.id}/maxresdefault.jpg"
             onerror="this.src='https://img.youtube.com/vi/${s.id}/hqdefault.jpg'"
             alt="${s.titulo || 'Short'}" loading="lazy">
        <div class="short-play">▶</div>
        <div class="short-card-overlay">
          <p class="short-card-title">${s.titulo || ''}</p>
        </div>
      </div>
    </a>`).join('');

  // Carousel navigation
  const prev = document.getElementById('shortsPrev');
  const next = document.getElementById('shortsNext');
  const scrollAmount = 220;
  prev?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
}

// ── Render longs embeds ───────────────────────────────────────────────────────
function renderLongs(longs) {
  const grid = document.getElementById('longsGrid');
  if (!grid) return;
  if (!longs.length) {
    grid.innerHTML = `
      <div class="longs-empty">
        <p>📺</p>
        <p>Los videos del canal aparecen aquí automáticamente.</p>
        <a href="https://www.youtube.com/@EnelEnsayoMedia" class="btn btn--outline" target="_blank" rel="noopener">Ver canal →</a>
      </div>`;
    return;
  }
  grid.innerHTML = longs.slice(0, 6).map(v => `
    <div class="long-card">
      <div class="long-embed">
        <iframe src="https://www.youtube.com/embed/${v.id}"
                title="${v.titulo || 'Video'}"
                frameborder="0" allowfullscreen loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
        </iframe>
      </div>
      <div class="long-card-info">
        <p class="long-card-title">${v.titulo || ''}</p>
        <span class="long-card-date">${v.fecha || ''}</span>
      </div>
    </div>`).join('');
}

// ── Render podcast cards ──────────────────────────────────────────────────────
function renderPodcast(episodes) {
  const grid = document.getElementById('podcastGrid');
  if (!grid) return;
  if (!episodes.length) {
    grid.innerHTML = `
      <div class="podcast-empty">
        <p>🎙️</p>
        <p style="font-weight:700;margin-bottom:0.5rem">Próximamente</p>
        <p style="font-size:0.9rem;color:var(--gray)">Los episodios del podcast aparecerán aquí.</p>
      </div>`;
    return;
  }
  grid.innerHTML = episodes.slice(0, 4).map(ep => `
    <a class="podcast-card" href="https://www.youtube.com/watch?v=${ep.id}" target="_blank" rel="noopener">
      <div class="podcast-thumb">
        <img src="https://img.youtube.com/vi/${ep.id}/maxresdefault.jpg"
             onerror="this.src='https://img.youtube.com/vi/${ep.id}/hqdefault.jpg'"
             alt="${ep.titulo || 'Episodio'}" loading="lazy">
        <div class="podcast-play">▶</div>
      </div>
      <div class="podcast-card-info">
        <p class="podcast-card-title">${ep.titulo || ''}</p>
        <span class="podcast-card-date">${ep.fecha || ''}</span>
      </div>
    </a>`).join('');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await cargarArticulos();
  initAnimations();
  initCounters();
  await cargarVideos();
});
