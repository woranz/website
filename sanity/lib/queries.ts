import { groq } from 'next-sanity'

// Producto público por segmento + slug
export const productoByRouteQuery = groq`
  *[
    _type == "producto" &&
    segmento == $segmento &&
    slug.current == $slug &&
    count(coalesce(pendientesValidacion, [])) == 0
  ][0] {
    _id,
    nombre,
    segmento,
    slug,
    badge,
    headline,
    subtitulo,
    heroImage,
    cardImage,
    ctaPrimario,
    ctaSecundario,
    secciones[] {
      _type,
      ...,
      "productos": productos[]-> {
        _id,
        nombre,
        segmento,
        slug,
        heroImage,
        cardImage,
        headline,
        subtitulo,
        pendientesValidacion
      }
    },
    pendientesValidacion
  }
`

// Todos los productos públicos
export const productosQuery = groq`
  *[
    _type == "producto" &&
    count(coalesce(pendientesValidacion, [])) == 0
  ] | order(coalesce(destacado, false) desc, coalesce(orden, 999) asc, nombre asc) {
    _id,
    segmento,
    nombre,
    slug,
    badge,
    heroImage,
    cardImage
  }
`

// Miembros del equipo
export const equipoQuery = groq`
  *[_type == "miembroEquipo" && mostrarEnHome == true] | order(orden asc) {
    _id,
    nombre,
    rol,
    foto
  }
`

// Productos agrupados por segmento para navegación
export const productosNavQuery = groq`
  *[
    _type == "producto" &&
    count(coalesce(pendientesValidacion, [])) == 0
  ] | order(coalesce(orden, 999) asc, nombre asc) {
    _id,
    nombre,
    segmento,
    slug,
    subtitulo
  }
`

// Página home por segmento
export const paginaHomeQuery = groq`
  *[_type == "paginaHome" && segmento == $segmento][0] {
    segmento,
    heroTitulo,
    heroSubtitulo,
    heroSubtituloMobile,
    heroFeatures,
    heroImagen,
    ctaPrimario,
    ctaSecundario,
    secciones[] {
      _type,
      ...,
      "productos": productos[]-> {
        _id,
        nombre,
        segmento,
        slug,
        heroImage,
        cardImage,
        headline,
        subtitulo,
        pendientesValidacion
      }
    },
    metaTitulo,
    metaDescripcion
  }
`

// Settings del sitio
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    titulo,
    descripcion,
    homeHeadline,
    homeSubtitulo,
    homeFaqs,
    contactoTitulo,
    contactoSubtitulo,
    ctaPrimarioHref,
    ctaSecundarioHref,
    whatsappNumero,
    emailContacto
  }
`
