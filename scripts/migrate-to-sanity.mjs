#!/usr/bin/env node

/**
 * Migrate product-catalog.json to Sanity CMS
 * Usage: node scripts/migrate-to-sanity.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SANITY_PROJECT_ID = 'hvh56bbh';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = 'skl9ZA6DQ92YcWHpJYz1aVQnDugK1OPMsgXiDNiFXC35ORoBd0J8P6Khh6ASG6va37vQ0eI7jy6YLZrsE6uu62CnRQufyxPrR1WUCcTHBRHl97HSDP51iIqIvUnx8YBU5DDhIiWMIw62WxT7B9v78LmzbMRrsktBZ1qzKPnDng1shzEw0zHD';
const API_VERSION = 'v2024-01-01';
const MUTATIONS_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/${API_VERSION}/data/mutate/${SANITY_DATASET}`;

const BATCH_SIZE = 10;

async function sanityMutate(mutations) {
  const res = await fetch(MUTATIONS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SANITY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Sanity API error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function addSanityKeys(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item, i) => {
    if (typeof item === 'object' && item !== null && !item._key) {
      return { _key: `item-${i}`, ...item };
    }
    if (typeof item === 'string') {
      return item; // strings in arrays don't need _key
    }
    return item;
  });
}

function mapProduct(p) {
  const id = `producto-${p.segmento}-${p.slug}`;

  const doc = {
    _id: id,
    _type: 'producto',
    nombre: p.nombre,
    segmento: p.segmento,
    slug: { _type: 'slug', current: p.slug },
    headline: p.headline,
    subtitulo: p.subtitulo || undefined,
    badge: p.badge || undefined,
  };

  // destacado & orden
  if (p.destacado !== undefined) doc.destacado = p.destacado;
  if (p.orden !== undefined) doc.orden = p.orden;

  // cotizador
  if (p.cotizador) {
    doc.cotizador = {
      modo: p.cotizador.modo,
      titulo: p.cotizador.titulo,
      descripcion: p.cotizador.descripcion,
      ctaLabel: p.cotizador.ctaLabel,
    };
    if (p.cotizador.ctaHref) doc.cotizador.ctaHref = p.cotizador.ctaHref;
  }

  // variantes
  if (p.variantes && p.variantes.length > 0) {
    doc.variantes = addSanityKeys(p.variantes.map((v, i) => {
      const variant = {
        _key: `variante-${i}`,
        titulo: v.titulo,
        descripcion: v.descripcion,
      };
      if (v.items) variant.items = v.items;
      if (v.href) variant.href = v.href;
      return variant;
    }));
  }

  // requisitos
  if (p.requisitos) {
    doc.requisitos = {
      titulo: p.requisitos.titulo,
      descripcion: p.requisitos.descripcion,
      items: p.requisitos.items,
    };
  }

  // coberturas
  if (p.coberturas && p.coberturas.length > 0) {
    doc.coberturas = p.coberturas.map((c, i) => ({
      _key: `cobertura-${i}`,
      titulo: c.titulo,
      descripcion: c.descripcion,
    }));
  }

  // pasos
  if (p.pasos && p.pasos.length > 0) {
    doc.pasos = p.pasos.map((paso, i) => ({
      _key: `paso-${i}`,
      numero: paso.numero,
      titulo: paso.titulo,
      descripcion: paso.descripcion,
    }));
  }

  // faqs
  if (p.faqs && p.faqs.length > 0) {
    doc.faqs = p.faqs.map((f, i) => ({
      _key: `faq-${i}`,
      pregunta: f.pregunta,
      respuesta: f.respuesta,
    }));
  }

  // CTA fields
  if (p.ctaTitulo) doc.ctaTitulo = p.ctaTitulo;
  if (p.ctaSubtitulo) doc.ctaSubtitulo = p.ctaSubtitulo;
  if (p.ctaBoton) doc.ctaBoton = p.ctaBoton;

  if (p.ctaPrimario) {
    doc.ctaPrimario = {
      label: p.ctaPrimario.label,
    };
    if (p.ctaPrimario.href) doc.ctaPrimario.href = p.ctaPrimario.href;
  }

  if (p.ctaSecundario) {
    doc.ctaSecundario = {
      label: p.ctaSecundario.label,
    };
    if (p.ctaSecundario.href) doc.ctaSecundario.href = p.ctaSecundario.href;
  }

  // pendientesValidacion
  if (p.pendientesValidacion && p.pendientesValidacion.length > 0) {
    doc.pendientesValidacion = p.pendientesValidacion;
  }

  return doc;
}

function buildHomePages() {
  return [
    {
      _id: 'paginaHome-personas',
      _type: 'paginaHome',
      segmento: 'personas',
      heroTitulo: 'Avanz\u00e1 tranquilo, nosotros te cubrimos.',
      heroSubtitulo: 'Seguros 100% digitales para que cotices, elijas tu plan y manejes todo desde tu celu. Sin papeles, sin vueltas.',
      heroSubtituloMobile: 'Seguros 100% digitales. Cotiz\u00e1, eleg\u00ed tu plan y manej\u00e1 todo desde tu celu.',
      heroFeatures: [
        { _key: 'feat-0', icon: 'shield-check', label: 'Prestacional' },
        { _key: 'feat-1', icon: 'zap', label: 'Orientaci\u00f3n al instante' },
        { _key: 'feat-2', icon: 'credit-card', label: 'Pagos online' },
      ],
      ctaPrimario: { label: 'Ver seguros', href: '#coberturas' },
      ctaSecundario: { label: 'Hablar con alguien \u2192' },
      metaTitulo: 'Woranz \u2014 Seguros para Personas',
      metaDescripcion: 'Seguros 100% online con personas reales del otro lado.',
    },
    {
      _id: 'paginaHome-empresas',
      _type: 'paginaHome',
      segmento: 'empresas',
      heroTitulo: 'Tu operaci\u00f3n no se puede frenar.',
      heroSubtitulo: 'Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.',
      heroSubtituloMobile: 'Nos ocupamos de las coberturas para que vos sigas avanzando.',
      heroFeatures: [
        { _key: 'feat-0', icon: 'building', label: 'Coberturas corporativas' },
        { _key: 'feat-1', icon: 'zap', label: 'Emisi\u00f3n en 24hs' },
        { _key: 'feat-2', icon: 'users', label: 'Equipo dedicado' },
      ],
      ctaPrimario: { label: 'Hablar con un especialista' },
      ctaSecundario: { label: 'Ver coberturas \u2192' },
      metaTitulo: 'Woranz \u2014 Seguros para Empresas',
      metaDescripcion: 'Tu operaci\u00f3n no se puede frenar. Nosotros nos ocupamos de las coberturas.',
    },
    {
      _id: 'paginaHome-productores',
      _type: 'paginaHome',
      segmento: 'productores',
      heroTitulo: 'M\u00e1s clientes, m\u00e1s simple.',
      heroSubtitulo: 'Cotiz\u00e1, emit\u00ed y gestion\u00e1 todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.',
      heroSubtituloMobile: 'Gestion\u00e1 coberturas desde un solo lugar. Sin Excel, sin drama.',
      heroFeatures: [
        { _key: 'feat-0', icon: 'briefcase', label: 'Portal para productores' },
        { _key: 'feat-1', icon: 'zap', label: 'Comisiones al instante' },
        { _key: 'feat-2', icon: 'credit-card', label: 'Pagos online' },
      ],
      ctaPrimario: { label: 'Empezar gratis' },
      ctaSecundario: { label: 'Conoc\u00e9 el portal \u2192' },
      metaTitulo: 'Woranz \u2014 Productores',
      metaDescripcion: 'Cotiz\u00e1, emit\u00ed y gestion\u00e1 coberturas desde un solo lugar.',
    },
  ];
}

async function main() {
  // Load catalog
  const catalogPath = join(__dirname, '..', 'data', 'product-catalog.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  console.log(`Loaded ${catalog.length} products from catalog.\n`);

  // Step 1: Delete test product
  console.log('--- Deleting test product a064659d-c9d3-40c9-ba2c-264704a07d21 ---');
  try {
    const deleteResult = await sanityMutate([
      { delete: { id: 'a064659d-c9d3-40c9-ba2c-264704a07d21' } },
    ]);
    console.log('Delete result:', JSON.stringify(deleteResult, null, 2));
  } catch (err) {
    console.log('Delete failed (may not exist):', err.message);
  }
  console.log('');

  // Step 2: Migrate products in batches
  const docs = catalog.map(mapProduct);
  console.log(`Mapped ${docs.length} product documents.\n`);

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(docs.length / BATCH_SIZE);

    console.log(`--- Product batch ${batchNum}/${totalBatches} (${batch.length} docs) ---`);
    console.log(`  IDs: ${batch.map(d => d._id).join(', ')}`);

    const mutations = batch.map(doc => ({ createOrReplace: doc }));

    try {
      const result = await sanityMutate(mutations);
      console.log(`  OK: transactionId=${result.transactionId}, results=${result.results?.length}`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }
    console.log('');
  }

  // Step 3: Create paginaHome documents
  console.log('--- Creating paginaHome documents ---');
  const homePages = buildHomePages();
  const homeMutations = homePages.map(doc => ({ createOrReplace: doc }));

  try {
    const result = await sanityMutate(homeMutations);
    console.log(`  IDs: ${homePages.map(d => d._id).join(', ')}`);
    console.log(`  OK: transactionId=${result.transactionId}, results=${result.results?.length}`);
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
  }

  console.log('\nMigration complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
