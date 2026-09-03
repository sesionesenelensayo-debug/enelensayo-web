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
  document.querySelectorAll('.section-header, .article-card, .featured-card, .about-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await cargarArticulos();
  initAnimations();
});
