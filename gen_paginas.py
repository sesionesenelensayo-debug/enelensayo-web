# Genera una página propia por sección a partir de fuente.html (la portada COMPLETA, con todas las secciones) y deja index.html como
# portada LIGERA: nota del día, lo último, Top 10, periódico y botones a cada sección.
# Uso: python3 gen_paginas.py   (se vuelve a correr cuando cambie fuente.html)
import re, os
AQUI = os.path.dirname(os.path.abspath(__file__))
PAGINAS = {  # archivo: (etiqueta de menú, título, descripción, [ids de sección])
    "noticias": ("Noticias", "Noticias de música y cultura de México", "Las últimas noticias de música y cultura de México: reportajes, entrevistas y notas propias con fuentes verificadas, publicadas todos los días.", ["notas", "noticias", "reportajes", "entrevistas"]),
    "chisme": ("Chisme", "Chisme y farándula", "Chisme y farándula en México con rigor: cantantes, actores, conductores e influencers; romances, rupturas y polémicas contadas con datos verificados y sin inventar nada.", ["chisme"]),
    "misterio": ("Misterio", "Misterio", "Terror, misterio y leyendas documentadas: historias reales y casos inexplicables investigados con fuentes y contados en video y texto.", ["misterio"]),
    "deporte": ("Deporte", "Deporte", "Lo que pasa en el deporte y en la música: noticias, resultados y análisis para seguir lo más importante del día.", ["deporte"]),
    "exclusivas": ("Exclusivas", "Notas exclusivas", "Lecturas largas diarias: esports, agenda woke, chismes internacionales y terror.", ["exclusivas"]),
    "top10": ("Top 10", "Top 10 semanal", "La cuenta regresiva semanal: lo más escuchado en México y en el mundo.", ["top10"]),
    "periodico": ("Periódico", "El Periódico", "La edición descargable de En el Ensayo Media, con publicidad y lo mejor de la semana.", ["periodico"]),
    "newsletter": ("Newsletter", "Newsletter", "Recibe El Periódico de En el Ensayo en tu correo, de lunes a viernes. Gratis.", ["newsletter"]),
    "cine": ("Cine", "Cine", "Una nota al día de cine: las más esperadas, los fracasos y las decepciones. Cuenta regresiva a Avengers: Doomsday.", ["cine"]),
    "television": ("Televisión", "Televisión", "Las 20 series mejor calificadas según IMDb, las más populares del momento y las noticias de la tele y el streaming.", ["television"]),
    "marveldc": ("Marvel y DCU", "Marvel y DCU", "Marvel Studios y DC Studios: noticias, taquilla, resultados y opinión sin anestesia sobre lo último del cine de superhéroes.", ["marveldc"]),
    "videojuegos": ("Videojuegos", "Videojuegos", "Videojuegos: estrenos, los peor calificados y las polémicas de la industria, con cuenta regresiva a GTA VI.", ["videojuegos"]),
    "luchas": ("Luchas", "Luchas", "WWE, AAA, CMLL y lucha japonesa: noticias, campeones y próximas funciones con precio, lugar y campeonatos.", ["luchas"]),
    "streaming": ("Live Streaming", "Live Streaming", "Los streamers más famosos de México, Latinoamérica y el mundo en Twitch y Kick: Kai Cenat, IShowSpeed, Ibai, Maestro Shifu, WestCOL y más, con su chisme y las últimas noticias.", ["streaming"]),
    "doblaje": ("Doblaje", "Doblaje", "La polémica de los star talents en el doblaje latino: Wildwood, Yo soy Rocky y más películas dobladas por famosos e influencers, con la línea de tiempo y todo lo que dicen los actores de doblaje.", ["doblaje"]),
    "conciertos": ("Conciertos", "Conciertos", "Conciertos y festivales en México: Vive Latino, Corona Capital, Tecate y más, con fechas, cartel y boletos, más el mapa de conciertos locales y foros independientes.", ["conciertos"]),
    "hitos": ("Hitos", "Hitos", "Los hitos que marcaron la música: fechas, discos y momentos históricos que cambiaron la historia del rock y la música popular.", ["hitos"]),
    "shorts": ("Shorts", "Shorts", "Nuestros videos cortos de música, historia y curiosidades: shorts nuevos del canal de En el Ensayo Media en YouTube.", ["shorts"]),
    "longs": ("Longs", "Videos largos", "Los videos largos del canal: documentales y biografías de bandas, músicos y pintores, narrados con fuentes verificadas.", ["longs"]),
    "podcast": ("Podcast", "Podcast", "El podcast de En el Ensayo Media: conversaciones y análisis sobre música, cultura y la escena de México.", ["podcast"]),
    "sesiones": ("Sesiones en vivo", "Sesiones en vivo", "Sesiones en vivo de En el Ensayo Media: conciertos, improvisaciones y presentaciones de bandas grabadas en el estudio.", ["sesiones"]),
    "sobre": ("Sobre nosotros", "Sobre nosotros", "Quiénes somos y cómo trabajamos en En el Ensayo Media: equipo, método de verificación de datos y política de correcciones.", ["estudio", "sobre"]),
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
ICONOS = {"marveldc": "🦸", "chisme": "💬", "misterio": "👻", "deporte": "⚽", "exclusivas": "⭐", "top10": "🏆", "periodico": "📰", "newsletter": "✉️", "cine": "🎬", "videojuegos": "🎮", "luchas": "🤼", "streaming": "📡", "doblaje": "🗣️", "television": "📺", "conciertos": "🎟️", "hitos": "🏅", "shorts": "📱", "longs": "📺", "podcast": "🎙️", "sesiones": "🎸", "sobre": "💡"}
botones = "".join(f'<a href="{k}.html"><span class="ic">{ICONOS.get(k, "🎵")}</span>{et}</a>' for k, (et, *_r) in PAGINAS.items() if k not in ("noticias",)) + "".join(f'<a href="{k}.html"><span class="ic">{ic}</span>{et}</a>' for k, et, ic in (("musica", "Música", "🎵"), ("memoriam", "In memoriam", "🕯️"), ("cultura", "Cultura", "🎭"), ("escena-local", "Escena local", "🎤")))
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
    h = h.replace('<link rel="canonical" href="https://enelensayomedia.com" />', f'<link rel="canonical" href="https://enelensayomedia.com/{k}.html" />')   # [.leon 2026-11-05] antes apuntaba a la portada en TODAS las secciones
    h = re.sub(r'<script type="application/ld\+json">.*?</script>', "", h, flags=re.S)
    # [.leon 2026-11-03] guía SEO de Google: migas de pan (BreadcrumbList) + CollectionPage por sección
    import json as _json
    _u = f"https://enelensayomedia.com/{k}.html"
    _ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": f"{tit} — En El Ensayo Media", "description": desc, "url": _u,
            "isPartOf": {"@type": "WebSite", "name": "En El Ensayo Media", "url": "https://enelensayomedia.com/"}},
           {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
               {"@type": "ListItem", "position": 1, "name": "En El Ensayo Media", "item": "https://enelensayomedia.com/"},
               {"@type": "ListItem", "position": 2, "name": tit, "item": _u}]}]
    h = h.replace("</head>", "".join('<script type="application/ld+json">' + _json.dumps(x, ensure_ascii=False) + "</script>" for x in _ld) + "</head>", 1)
    cuerpo = "".join(seccion(i) for i in ids)
    cuerpo = cuerpo.replace('class="section section--dark', 'class="section section--dark', 1)
    cuerpo = re.sub(r'<h2 class="section-title">(.*?)</h2>', r'<h1 class="section-title">\1</h1>', cuerpo, count=1, flags=re.S)   # [.leon 2026-11-05] un h1 por página (guía SEO)
    pag = h + "<body>\n\n" + menu(nav, k) + f'  <header class="pag-cab"><div class="section-inner"><a class="pag-volver" href="/">← Portada</a></div></header>\n  <div class="section-inner" data-slot="cabecera"></div>\n' + cuerpo + "\n" + footer + scripts
    open(os.path.join(AQUI, f"{k}.html"), "w", encoding="utf-8").write(pag)

# [.leon 2026-11-05] Landing propias de las secciones que no tenían página (notas por categoría + shorts y longs incrustados de esa sección)
NUEVAS = {
    "musica": ("Música", "Música", "Lo que pasa en la música: lanzamientos, noticias, biografías y datos curiosos de bandas y artistas, con los videos y documentales del canal.", "Música actual", "Música", ["Música", "Internacional", "Biografía", "Datos curiosos"]),
    "memoriam": ("In memoriam", "In memoriam", "Despedidas verificadas: la vida y el legado de quienes fallecen, contados con datos confirmados, respeto y los videos del canal.", "Homenajes", "In <span class=\"text-accent\">memoriam</span>", ["In memoriam"]),
    "cultura": ("Cultura", "Cultura pop y memoria", "Cultura pop, historia y memoria: notas propias, curiosidades y reportajes con sus videos y documentales.", "Cultura pop", "<span class=\"text-accent\">Cultura</span> y memoria", ["Cultura"]),
    "escena-local": ("Escena local", "Escena local de México", "La música en vivo de México: bandas, festivales y fechas cerca de ti. Mira también el mapa de conciertos locales.", "Música en vivo", "Escena <span class=\"text-accent\">local</span>", ["Escena local"]),
}
for k, (et, tit, desc, eyebrow, h1, cats) in NUEVAS.items():
    h = re.sub(r"<title>.*?</title>", f"<title>{tit} — En El Ensayo Media</title>", head, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*', r"\g<1>" + desc, h)
    h = h.replace('content="https://enelensayomedia.com" />', f'content="https://enelensayomedia.com/{k}.html" />')
    h = h.replace('<link rel="canonical" href="https://enelensayomedia.com" />', f'<link rel="canonical" href="https://enelensayomedia.com/{k}.html" />')
    h = re.sub(r'<script type="application/ld\+json">.*?</script>', "", h, flags=re.S)
    import json as _json
    _u = f"https://enelensayomedia.com/{k}.html"
    _ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": f"{tit} — En El Ensayo Media", "description": desc, "url": _u,
            "isPartOf": {"@type": "WebSite", "name": "En El Ensayo Media", "url": "https://enelensayomedia.com/"}},
           {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
               {"@type": "ListItem", "position": 1, "name": "En El Ensayo Media", "item": "https://enelensayomedia.com/"},
               {"@type": "ListItem", "position": 2, "name": tit, "item": _u}]}]
    h = h.replace("</head>", "".join('<script type="application/ld+json">' + _json.dumps(x, ensure_ascii=False) + "</script>" for x in _ld) + '<link rel="stylesheet" href="css/seccion.css?v=20261105"></head>', 1)
    cuerpo = f'''  <section class="section" id="secLanding" data-cats="{'|'.join(cats)}" data-max="24">
    <div class="section-inner">
      <div class="section-header">
        <p class="section-eyebrow"><span class="dot dot--yellow"></span>{eyebrow}</p>
        <h1 class="section-title">{h1}</h1>
        <p class="section-desc">{desc}</p>
      </div>
      <h2 class="sx-sub">Últimas notas</h2>
      <div class="sx-grid sx-notas" id="secNotas"><p class="sx-vacio">Cargando notas…</p></div>
      <h2 class="sx-sub" id="secLongsT">Videos largos y documentales</h2>
      <div class="sec-vids" id="secLongs"></div>
      <h2 class="sx-sub" id="secShortsT">Shorts</h2>
      <div class="sec-vids cortos" id="secShorts"></div>
    </div>
  </section>
'''
    pag = h + "<body>\n\n" + menu(nav, k) + '  <header class="pag-cab"><div class="section-inner"><a class="pag-volver" href="/">← Portada</a></div></header>\n  <div class="section-inner" data-slot="cabecera"></div>\n' + cuerpo + "\n" + footer + scripts.replace('  <script src="js/main.js"', '  <script src="js/seccion.js?v=20261105"></script>\n  <script src="js/main.js"', 1)
    open(os.path.join(AQUI, f"{k}.html"), "w", encoding="utf-8").write(pag)
print("páginas nuevas:", len(NUEVAS))
print("páginas:", len(PAGINAS))
