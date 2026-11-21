/* ==========================================================================
   NITOR 3.0 — CONFIGURACIÓN DEL PORTAFOLIO
   Este es el ÚNICO archivo que necesitas editar para gestionar tu contenido.
   ========================================================================== */

window.NITOR_CONFIG = {

  /* ---------- CONTACTO ----------
     Número de WhatsApp con código de país, sin "+", espacios ni guiones. */
  whatsapp: "584121354734",

  /* ---------- REDES SOCIALES ----------
     Pega el enlace completo de cada perfil. Si lo dejas vacío (""), no se muestra. */
  socials: {
    instagram: "",
    tiktok: "",
    youtube: "https://www.youtube.com/@NitorXit"
  },

  /* ---------- VIDEO DESTACADO (HERO) ----------
     Escribe aquí el ID del video que quieres mostrar en la primera pantalla.
     Si lo dejas vacío, se usa el primer video marcado con featured: true,
     y si no hay ninguno, el primer video de la lista. */
  featuredId: "JwTngWAtWIE",

  /* ---------- CATEGORÍAS / ESTILOS DE EDICIÓN ----------
     key        → identificador que usan los videos en "category".
     label      → texto corto para filtros.
     title      → título de la tarjeta.
     description→ descripción breve.
     cover      → (opcional) URL o ruta de una imagen de portada.
                  Si se deja vacío, se usa la miniatura del primer video de la categoría.
     videoTypes → opciones de "Tipo de video" que aparecen en el cotizador. */
  categories: [
    {
      key: "gaming",
      label: "GAMING",
      title: "Gaming",
      description: "Free Fire, Fortnite, gameplays, clips y montajes con efectos, transiciones y sincronización musical.",
      cover: "",
      videoTypes: ["Montaje / edit con música", "Clips y momentos destacados", "Gameplay largo para YouTube", "Short / Reel gaming"]
    },
    {
      key: "ads",
      label: "PUBLICIDAD",
      title: "Publicidad y ventas",
      description: "Anuncios para negocios, productos, tiendas y marcas. Ofertas y contenido comercial pensado para captar clientes.",
      cover: "",
      videoTypes: ["Anuncio de producto", "Promoción u oferta", "Video de ventas", "Presentación de marca o negocio"]
    },
    {
      key: "instagram",
      label: "INSTAGRAM",
      title: "Instagram y marca personal",
      description: "Reels educativos, consejos, videos a cámara y clips de entrevistas con subtítulos dinámicos.",
      cover: "",
      videoTypes: ["Consejos / contenido educativo", "Video hablando a cámara", "Clips de podcast o entrevista", "Contenido de marca personal"]
    },
    {
      key: "historias",
      label: "HISTORIAS",
      title: "Historias y storytelling",
      description: "Relatos, anécdotas y curiosidades narradas con ritmo, tensión y remates que retienen hasta el final.",
      cover: "",
      videoTypes: ["Historia narrada", "Anécdota o curiosidad", "Recap / resumen de una historia", "Serie de historias"]
    },
    {
      key: "comida",
      label: "COMIDA",
      title: "Comida y restaurantes",
      description: "Videos foodie para restaurantes, locales y creadores gastronómicos que abren el apetito desde el primer segundo.",
      cover: "",
      videoTypes: ["Reseña de restaurante", "Ruta o recomendaciones foodie", "Promoción de menú o local", "Short / Reel gastronómico"]
    },
    {
      key: "inmuebles",
      label: "INMUEBLES",
      title: "Inmuebles y bienes raíces",
      description: "Recorridos de propiedades en venta o alquiler con tomas limpias, textos de datos clave y ritmo que vende.",
      cover: "",
      videoTypes: ["Recorrido de propiedad", "Anuncio de venta o alquiler", "Presentación de proyecto inmobiliario", "Short / Reel inmobiliario"]
    }
  ],

  /* ---------- VIDEOS ----------
     Para añadir un video: duplica una línea y cambia sus datos.
     id          → ID de YouTube. Ej: youtube.com/shorts/ABC123  →  "ABC123"
     title       → nombre del proyecto.
     description → breve descripción.
     category    → gaming | ads | instagram | historias
     thumbnail   → (opcional) URL o ruta de una miniatura propia.
     featured    → (opcional) true para proponerlo como destacado.
     format      → (opcional) "vertical" (Shorts/Reels, por defecto) o "horizontal" (videos largos 16:9). */
  videos: [
    { id: "fBRFWKUEzK8", title: "Campaña Buen Fin", description: "Anuncio de descuentos con textos animados y ritmo comercial.", category: "ads", featured: true },
    { id: "2ChHZUR3LQA", title: "Fortnite · Práctica", description: "Edición gaming con gráficos, cortes dinámicos y efectos.", category: "gaming" },
    { id: "KEQ0nnF3DEA", title: "Mi primera vez en Fortnite", description: "Gameplay con humor, reacciones y momentos destacados.", category: "gaming" },
    { id: "JwTngWAtWIE", title: "¿Quién es Fermirayes?", description: "Clip de entrevista con subtítulos y edición a cámara.", category: "instagram" },
    { id: "TjRpvFzaNKs", title: "Instagram te espía", description: "Reel educativo hablando a cámara con subtítulos dinámicos.", category: "instagram" },
    { id: "_B6YFHeOcVE", title: "Su plan salió al revés", description: "Historia narrada con giro final, ritmo y subtítulos.", category: "historias" },
    { id: "RdzUaIP9hh4", title: "Eugenio Derbez y MrBeast", description: "Storytelling sobre una anécdota viral, con tensión y remate.", category: "historias" },
    { id: "5oL_ahCX1ug", title: "Publicidad random a marcas famosas", description: "Anuncio en clave de humor con cortes rápidos y remates cómicos.", category: "ads" },
    { id: "6SOfE7Ify1Q", title: "Smart TV · Tiendas Daka", description: "Video de producto con textos animados y enfoque en ventas.", category: "ads" },
    { id: "jCp9GMs1u3E", title: "Prepara tu propio perro caliente", description: "Reel foodie mostrando un local único con ritmo y antojo.", category: "comida" },
    { id: "p6fhqGRqLAU", title: "El mejor hot dog de Sudamérica", description: "Video gastronómico con tomas de producto y reacciones.", category: "comida" },
    { id: "MKBw7vWapqE", title: "3 lugares para comer perros en Caracas", description: "Ruta foodie con subtítulos dinámicos y recomendaciones.", category: "comida" },
    { id: "DFZKL98E5mo", title: "Casa colonial en La Asunción", description: "Recorrido de propiedad en venta en Isla de Margarita.", category: "inmuebles" },
    { id: "gRRXKV7YlbI", title: "Casa en venta en Margarita", description: "Tour inmobiliario con datos clave y tomas limpias.", category: "inmuebles" },
    { id: "7EYG1UvahnE", title: "Abraham y el mod de Verity", description: "Edit de Minecraft con sustos, efectos y sincronización.", category: "gaming" },
    { id: "7T1EA6ipUNk", title: "El primer modo creativo de Minecraft", description: "Clip gaming con ritmo, gráficos y momentos destacados.", category: "gaming" },
    { id: "wWrxDPXKI6o", title: "3 consejos para BR clasificatoria", description: "Short educativo gaming con textos y cortes dinámicos.", category: "gaming" },
    { id: "dSUN8AgrRso", title: "5 DETALLES ALUCINANTES de GTA 6", description: "Short consejos gaming con textos y cortes dinámicos.", category: "gaming" },
  ]
};
