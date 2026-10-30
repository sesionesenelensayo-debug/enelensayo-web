# Genera una página propia por sección a partir de fuente.html (la portada COMPLETA, con todas las secciones) y deja index.html como
# portada LIGERA: nota del día, lo último, Top 10, periódico y botones a cada sección.
# Uso: python3 gen_paginas.py   (se vuelve a correr cuando cambie fuente.html)
import re, os
AQUI = os.path.dirname(os.path.abspath(__file__))
PAGINAS = {  # archivo: (etiqueta de menú, título, descripción, [ids de sección])
    "noticias": ("Noticias", "Noticias", "Las últimas noticias de música y cultura de México.", ["notas", "noticias", "reportajes", "entrevistas"]),
    "chisme": ("Chisme", "Chisme", "El chisme del espectáculo, con rigor.", ["chisme"]),
    "misterio": ("Misterio", "Misterio", "Terror, misterio y leyendas documentadas.", ["misterio"]),
    "deporte": ("Deporte", "Deporte", "Lo que pasa en el deporte.", ["deporte"]),
    "exclusivas": ("Exclusivas", "Notas exclusivas", "Lecturas largas diarias: esports, agenda woke, chismes internacionales y terror.", ["exclusivas"]),
    "top10": ("Top 10", "Top 10 semanal", "La cuenta regresiva semanal: lo más escuchado en México y en el mundo.", ["top10"]),
    "periodico": ("Periódico", "El Periódico", "La edición descargable de En el Ensayo Media, con publicidad y lo mejor de la semana.", ["periodico"]),
    "newsletter": ("Newsletter", "Newsletter", "Recibe El Periódico de En el Ensayo en tu correo, de lunes a viernes. Gratis.", ["newsletter"]),
    "cine": ("Cine", "Cine", "Una nota al día de cine: las más esperadas, los fracasos y las decepciones. Cuenta regresiva a Avengers: Doomsday.", ["cine"]),
    "videojuegos": ("Videojuegos", "Videojuegos", "Estrenos, peor calificados y polémicas. Cuenta regresiva a GTA VI.", ["videojuegos"]),
    "conciertos": ("Conciertos", "Conciertos", "Boletos y planes: conciertos y eventos.", ["conciertos"]),
    "hitos": ("Hitos", "Hitos", "Los momentos que marcaron la música.", ["hitos"]),
    "shorts": ("Shorts", "Shorts", "Nuestros videos cortos.", ["shorts"]),
    "longs": ("Longs", "Videos largos", "Los videos largos del canal.", ["longs"]),
    "podcast": ("Podcast", "Podcast", "El podcast de En el Ensayo Media.", ["podcast"]),
    "sobre": ("Sobre nosotros", "Sobre nosotros", "Quiénes somos y cómo trabajamos.", ["estudio", "sobre"]),
}
src = open(os.path.join(AQUI, "fuente.html"), encoding="utf-8").read()

def seccion(i):
    m = re.search(r'  <section [^>]*id="%s".*?</section>\n' % i, src, re.S)
    return m.group(0) if m else ""

head = src[:src.index("<body>")]
footer = src[src.index("  <!-- ── NEWSLETTER CTA"):src.index("  <script src=\"js/main.js\"")]
scripts = src[src.index("  <script src=\"js/main.js\""):]
nav = src[src.index("  <!-- ── NAVBAR"):src.index("  <!-- ── PORTADA")]
ENL = {"notas": "noticias", "noticias": "noticias"}

def menu(n, activo):
    for k, (et, *_r) in PAGINAS.items():
        n = re.sub(r'<a href="#%s"(?=>%s</a>)' % (re.escape(k if k != "noticias" else "notas"), re.escape(et)),
                   '<a href="%s.html"%s' % (k, ' class="activa" aria-current="page"' if k == activo else ""), n)
    return n

# portada LIGERA: cabecera + menú + portada (nota del día, lo último, videos) + Top 10 + periódico + botones de sección
portada = src[src.index("  <!-- ── PORTADA"):src.index("  <!-- ── HERO")]
botones = "".join(f'<a href="{k}.html">{et}</a>' for k, (et, *_r) in PAGINAS.items() if k not in ("noticias",))
extra = f'''  <section class="section" id="top10-mini"><div class="section-inner">
    <div class="section-header"><p class="section-eyebrow"><span class="dot dot--yellow"></span>Cuenta regresiva semanal</p>
      <h2 class="section-title">Top <span class="text-accent">10</span></h2></div>
    <div class="t10-mini" id="t10Mini"></div><p style="margin-top:14px"><a class="sx-mas" style="text-decoration:none;display:inline-block" href="top10.html">Ver el Top 10 completo →</a></p>
  </div></section>

  <section class="section" id="periodico-mini"><div class="section-inner">
    <div class="section-header"><p class="section-eyebrow"><span class="dot dot--yellow"></span>Edición descargable</p>
      <h2 class="section-title">El <span class="text-accent">Periódico</span></h2></div>
    <div class="per-caja" id="perMini"></div>
    <div class="per-ad"><b>¿Quieres que tu marca salga aquí?</b> <a href="anunciate.html">Anúnciate en el periódico y en el sitio →</a></div>
  </div></section>

  <section class="section" id="secciones"><div class="section-inner">
    <div class="section-header"><p class="section-eyebrow"><span class="dot dot--yellow"></span>Explora</p>
      <h2 class="section-title">Todas las <span class="text-accent">secciones</span></h2></div>
    <div class="secciones-grid">{botones}</div>
  </div></section>

'''
def bloque(idb, eyebrow, titulo, pagina):
    return (f'''  <section class="section" id="b-{idb}" data-bloque="1"><div class="section-inner">
    <div class="section-header"><p class="section-eyebrow"><span class="dot dot--yellow"></span>{eyebrow}</p><h2 class="section-title">{titulo}</h2></div>
    <div class="sx-grid sx-notas" id="blk{idb}"></div><a class="blk-mas" href="{pagina}">Ver todo →</a>
  </div></section>

''')


graficas = '''  <section class="section" id="graficas"><div class="section-inner">
    <div class="section-header"><p class="section-eyebrow"><span class="dot dot--yellow"></span>Lo más escuchado</p>
      <h2 class="section-title">Los artistas más <span class="text-accent">escuchados</span></h2></div>
    <div class="gr-cols"><div><h3 class="sx-sub">México hoy</h3><div id="grafMx"></div></div><div><h3 class="sx-sub">Mundo</h3><div id="grafMundo"></div></div></div>
    <p class="sx-aviso" id="grafFuente"></p>
  </div></section>

'''
bloques = graficas + bloque("Musica", "Música actual", "Música: <span class=\"text-accent\">lo que pasa hoy</span>", "noticias.html") + \
    bloque("Chisme", "Famosos y espectáculos", "<span class=\"text-accent\">Chisme</span> de hoy", "chisme.html") + \
    bloque("Cine", "Pantalla grande", "<span class=\"text-accent\">Cine</span>", "cine.html") + \
    bloque("Cultura", "Cultura pop", "<span class=\"text-accent\">Cultura</span>", "noticias.html") + \
    bloque("Juegos", "Controles en mano", "Video<span class=\"text-accent\">juegos</span>", "videojuegos.html")
corte = '  <section class="section" id="notas">'
portada = portada.replace(corte, bloques + corte, 1) if corte in portada else portada + bloques
idx = head + "<body>\n\n" + menu(nav, "") + portada + extra + footer + scripts
open(os.path.join(AQUI, "index.html"), "w", encoding="utf-8").write(idx)
for k, (et, tit, desc, ids) in PAGINAS.items():
    h = re.sub(r"<title>.*?</title>", f"<title>{tit} — En El Ensayo Media</title>", head, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*', r"\g<1>" + desc, h)
    h = h.replace('content="https://enelensayomedia.com" />', f'content="https://enelensayomedia.com/{k}.html" />')
    h = re.sub(r'<script type="application/ld\+json">.*?</script>', "", h, flags=re.S)
    cuerpo = "".join(seccion(i) for i in ids)
    cuerpo = cuerpo.replace('class="section section--dark', 'class="section section--dark', 1)
    pag = h + "<body>\n\n" + menu(nav, k) + f'  <header class="pag-cab"><div class="section-inner"><a class="pag-volver" href="/">← Portada</a></div></header>\n' + cuerpo + "\n" + footer + scripts
    open(os.path.join(AQUI, f"{k}.html"), "w", encoding="utf-8").write(pag)
print("páginas:", len(PAGINAS))
