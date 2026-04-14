function normalizeTitle(title) {
  return title
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function isCoverageLikeRequirements(requirements) {
  if (!requirements?.items?.length) {
    return false
  }

  const normalizedTitle = normalizeTitle(requirements.titulo)
  return normalizedTitle === "que cubre" || normalizedTitle === "que asegura"
}

function buildCoverageItemsFromRequirements(requirements) {
  if (!isCoverageLikeRequirements(requirements)) {
    return []
  }

  const fallbackDescription =
    requirements?.descripcion?.trim() || "Cobertura disponible para este producto."

  return (requirements?.items ?? [])
    .filter(Boolean)
    .map((item, index) => ({
      _key: `coverage-from-requirements-${index}`,
      titulo: String(item).trim(),
      descripcion: fallbackDescription,
    }))
}

function mapVariantItems(variantes = []) {
  return variantes
    .filter((variant) => variant?.titulo)
    .map((variant, index) => ({
      _key: variant._key ?? `variante-${index}`,
      titulo: variant.titulo?.trim(),
      descripcion: variant.descripcion?.trim(),
      ...(variant.items?.length ? { items: variant.items.filter(Boolean) } : {}),
      ...(variant.href ? { href: variant.href.trim() } : {}),
    }))
}

function mapFaqItems(faqs = []) {
  return faqs
    .filter((faq) => faq?.pregunta || faq?.respuesta)
    .map((faq, index) => ({
      _key: faq._key ?? `faq-${index}`,
      ...(faq.pregunta ? { pregunta: faq.pregunta.trim() } : {}),
      ...(faq.respuesta ? { respuesta: faq.respuesta.trim() } : {}),
    }))
}

function mapCoverageItems(coberturas = []) {
  return coberturas
    .filter((item) => item?.titulo || item?.descripcion)
    .map((item, index) => ({
      _key: item._key ?? `cobertura-${index}`,
      ...(item.titulo ? { titulo: item.titulo.trim() } : {}),
      ...(item.descripcion ? { descripcion: item.descripcion.trim() } : {}),
    }))
}

function mapStepItems(pasos = []) {
  return pasos
    .filter((step) => step?.numero || step?.titulo || step?.descripcion)
    .map((step, index) => ({
      _key: step._key ?? `paso-${index}`,
      ...(step.numero ? { numero: step.numero.trim() } : {}),
      ...(step.titulo ? { titulo: step.titulo.trim() } : {}),
      ...(step.descripcion ? { descripcion: step.descripcion.trim() } : {}),
    }))
}

function sanitizeReferences(items = []) {
  return items
    .filter((item) => item?._ref)
    .map((item, index) => ({
      _key: item._key ?? `producto-relacionado-${index}`,
      _type: "reference",
      _ref: item._ref,
    }))
}

export function buildProductSectionsFromLegacy(product) {
  const sections = []
  const variantes = mapVariantItems(product.variantes)
  const requisitos = product.requisitos
  const requisitosAsCoverage = buildCoverageItemsFromRequirements(requisitos)
  const coberturas = mapCoverageItems(product.coberturas)
  const pasos = mapStepItems(product.pasos)
  const faqs = mapFaqItems(product.faqs)
  const productosRelacionados = sanitizeReferences(product.productosRelacionados)

  if (variantes.length > 0) {
    sections.push({
      _key: "legacy-variantes",
      _type: "seccionVariantes",
      titulo: "Variantes",
      items: variantes,
    })
  }

  if (requisitos?.items?.length && requisitosAsCoverage.length === 0) {
    sections.push({
      _key: "legacy-requisitos",
      _type: "seccionRequisitos",
      titulo: requisitos.titulo?.trim() || "Requisitos",
      ...(requisitos.descripcion ? { descripcion: requisitos.descripcion.trim() } : {}),
      items: requisitos.items.filter(Boolean).map((item) => String(item).trim()),
    })
  }

  if (product.cotizador?.modo) {
    sections.push({
      _key: "legacy-cotizador",
      _type: "seccionCotizador",
      titulo: product.cotizador.titulo?.trim() || "Cotizá tu cobertura",
      ...(product.cotizador.descripcion
        ? { descripcion: product.cotizador.descripcion.trim() }
        : {}),
      modo: product.cotizador.modo,
      maxWidth: product.cotizador.modo === "inline-caucion" ? "wide" : "default",
      mostrarPasosMobile: pasos.length > 0,
      ...(pasos.length > 0 ? { pasos } : {}),
    })
  } else if (pasos.length > 0) {
    sections.push({
      _key: "legacy-pasos",
      _type: "seccionPasos",
      pasos,
    })
  }

  const coverageItems = coberturas.length > 0 ? coberturas : requisitosAsCoverage
  if (coverageItems.length > 0) {
    sections.push({
      _key: "legacy-coberturas",
      _type: "seccionCobertura",
      titulo: "Qué cubre",
      items: coverageItems,
    })
  }

  if (faqs.length > 0) {
    sections.push({
      _key: "legacy-faqs",
      _type: "seccionFaq",
      titulo: "Preguntas frecuentes",
      items: faqs,
    })
  }

  if (productosRelacionados.length > 0) {
    sections.push({
      _key: "legacy-relacionados",
      _type: "seccionCarouselProductos",
      titulo: "Más opciones para vos",
      productos: productosRelacionados,
    })
  }

  if (
    product.ctaTitulo?.trim() ||
    product.ctaSubtitulo?.trim() ||
    product.ctaPrimario?.label?.trim() ||
    product.ctaSecundario?.label?.trim()
  ) {
    sections.push({
      _key: "legacy-cta",
      _type: "seccionCta",
      titulo: product.ctaTitulo?.trim() || "¿Querés que te ayudemos a elegir?",
      ...(product.ctaSubtitulo?.trim()
        ? { descripcion: product.ctaSubtitulo.trim() }
        : {}),
      ...(product.ctaPrimario ? { ctaPrimario: product.ctaPrimario } : {}),
      ...(product.ctaSecundario ? { ctaSecundario: product.ctaSecundario } : {}),
    })
  }

  return sections
}
