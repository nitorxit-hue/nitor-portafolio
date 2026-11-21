# NITOR 3.0 — Portafolio de video editor

Sitio estático (HTML + CSS + JS) listo para Netlify. Sin dependencias, sin build.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Estructura de la página (no hace falta tocarlo) |
| `config.js` | **Todo tu contenido**: videos, categorías, destacado, WhatsApp y redes |
| `styles.css` | Diseño visual |
| `app.js` | Funcionalidad (filtros, modal, cotizador, menú) |
| `netlify.toml` | Configuración de Netlify (cabeceras de seguridad y caché) |
| `assets/` | Favicon e imagen para compartir en redes (Open Graph) |

## Publicar en Netlify

1. Entra en https://app.netlify.com/drop
2. Arrastra la carpeta del proyecto (o el ZIP descomprimido).
3. Listo. No hay comando de build ni carpeta de publicación especial (`.`).

## Agregar un video nuevo

Abre `config.js` y añade un objeto dentro de `videos`:

```js
{
  id: "RdzUaIP9hh4",            // ID de YouTube (lo que va después de /shorts/ o ?v=)
  title: "Título del proyecto",
  description: "Descripción breve.",
  category: "historias",          // gaming | ads | instagram | historias
  format: "short",                // short (vertical) | long (horizontal) — opcional
  thumbnail: "",                  // opcional: URL de una miniatura propia
  featured: false                 // opcional
}
```

- **Eliminar** un video: borra su objeto.
- **Editar** un video: cambia sus textos.
- **Reclasificar**: cambia `category`.
- El contador de proyectos de cada categoría y los filtros se calculan solos.

## Cambiar el video destacado (hero)

En `config.js` cambia `featuredId` por el `id` del video que quieras destacar.
Si lo dejas vacío, se usa el primer video con `featured: true`, o el primero de la lista.

## WhatsApp y redes

- `whatsapp`: número en formato internacional sin `+` ni espacios.
- `socials`: pega la URL real de cada perfil. Si un campo está vacío (`""`),
  ese botón no se muestra. Actualmente solo YouTube está configurado;
  agrega tus enlaces de Instagram y TikTok cuando quieras que aparezcan.

## Categorías

Las categorías (`gaming`, `ads`, `instagram`, `historias`) se definen en `categories`
dentro de `config.js`: título, descripción y el video usado como portada.

## Notas

- Los reproductores de YouTube solo se cargan cuando el visitante pulsa play (modo `youtube-nocookie`).
- Las miniaturas se cargan de YouTube con lazy loading.
- Las animaciones se desactivan si el sistema tiene "reducir movimiento" activo.
- El cotizador no cobra nada: arma un mensaje ordenado y abre WhatsApp para acordar el pago.
