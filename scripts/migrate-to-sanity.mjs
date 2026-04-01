#!/usr/bin/env node

/**
 * Migrate product-catalog.json to Sanity CMS
 * Usage: node scripts/migrate-to-sanity.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildProductSectionsFromLegacy } from './lib/product-sections.mjs';

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
    secciones: buildProductSectionsFromLegacy({
      ...p,
      productosRelacionados: (p.productosRelacionados ?? []).map((key, i) => ({
        _key: `producto-relacionado-${i}`,
        _type: 'reference',
        _ref: `producto-${key.replace('/', '-')}`,
      })),
    }),
  };

  // destacado & orden
  if (p.destacado !== undefined) doc.destacado = p.destacado;
  if (p.orden !== undefined) doc.orden = p.orden;

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
        { _key: 'feat-0', icono: 'shield-check', texto: 'Prestacional' },
        { _key: 'feat-1', icono: 'zap', texto: 'Orientaci\u00f3n al instante' },
        { _key: 'feat-2', icono: 'credit-card', texto: 'Pagos online' },
      ],
      ctaPrimario: { label: 'Ver seguros', href: '#coberturas' },
      ctaSecundario: { label: 'Hablar con alguien \u2192' },
      secciones: [
        {
          _key: 'prods001',
          _type: 'seccionCarouselProductos',
          titulo: 'Estamos en cada momento',
          productos: [
            { _key: 'r1', _ref: 'producto-personas-caucion-alquiler', _type: 'reference' },
            { _key: 'r2', _ref: 'producto-personas-seguro-de-hogar', _type: 'reference' },
            { _key: 'r3', _ref: 'producto-personas-accidentes-personales', _type: 'reference' },
            { _key: 'r4', _ref: 'producto-personas-robo-celular', _type: 'reference' },
            { _key: 'r5', _ref: 'producto-personas-caucion-turismo-estudiantil', _type: 'reference' },
          ],
        },
        {
          _key: 'steps001',
          _type: 'seccionPasos',
          pasos: [
            {
              _key: 'p1',
              numero: '01',
              titulo: 'Cotiz\u00e1 online',
              descripcion: 'Eleg\u00ed tu cobertura y recib\u00ed tu precio en segundos. Sin formularios ni datos personales.',
            },
            {
              _key: 'p2',
              numero: '02',
              titulo: 'Contrat\u00e1',
              descripcion: 'Pag\u00e1 como quieras: tarjeta, d\u00e9bito o transferencia. Todo por Mercado Pago.',
            },
            {
              _key: 'p3',
              numero: '03',
              titulo: 'Listo, te cubrimos',
              descripcion: 'Tu p\u00f3liza llega al toque a tu celu. Siempre disponible en tu cuenta Woranz.',
            },
          ],
        },
        {
          _key: 'feat001',
          _type: 'seccionCarouselFeatures',
          titulo: 'Seguros pensados para vos.',
          items: [
            {
              _key: 'i1',
              texto: 'Cotiz\u00e1 y gestion\u00e1 todo online, cuando quieras.',
              textoMobile: 'Cotiz\u00e1 y consult\u00e1 tus p\u00f3lizas online 24/7.',
            },
            {
              _key: 'i2',
              texto: 'Siempre cerca tuyo, siempre a un mensaje.',
              textoMobile: 'Siempre cerca tuyo ayud\u00e1ndote a avanzar.',
            },
            {
              _key: 'i3',
              texto: 'El mejor precio, el mejor producto. Sin vueltas.',
              textoMobile: 'El mejor precio, sin vueltas.',
            },
            {
              _key: 'i4',
              texto: 'Simple, online y con la mejor experiencia.',
              textoMobile: 'Simple, online y con la mejor experiencia.',
            },
          ],
        },
        {
          _key: 'cta001',
          _type: 'seccionCta',
          titulo: '\u00bfTen\u00e9s dudas? Hablemos.',
          tituloMobile: 'Cuando lo necesites, estamos.',
          descripcion: 'No somos un call center. Somos personas reales que te acompa\u00f1an en cada paso.',
          teamCount: '+21',
          teamLabel: 'personas cuidando de vos',
          ctaPrimario: { label: 'Ver seguros', href: '#coberturas' },
          ctaSecundario: { label: 'Habl\u00e1 con nosotros \u2192' },
        },
      ],
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
        { _key: 'feat-0', icono: 'building', texto: 'Coberturas corporativas' },
        { _key: 'feat-1', icono: 'zap', texto: 'Emisi\u00f3n en 24hs' },
        { _key: 'feat-2', icono: 'users', texto: 'Equipo dedicado' },
      ],
      ctaPrimario: { label: 'Hablar con un especialista' },
      ctaSecundario: { label: 'Ver coberturas \u2192' },
      secciones: [
        {
          _key: 'grid001',
          _type: 'seccionGridProductos',
          titulo: 'Nuestras coberturas',
          productos: [
            { _key: 'r1', _ref: 'producto-empresas-accidentes-personales', _type: 'reference' },
            { _key: 'r2', _ref: 'producto-empresas-caucion-turismo-estudiantil-agencias', _type: 'reference' },
            { _key: 'r3', _ref: 'producto-empresas-cauciones-tradicionales', _type: 'reference' },
            { _key: 'r4', _ref: 'producto-empresas-caucion-alquiler-comercial', _type: 'reference' },
            { _key: 'r5', _ref: 'producto-empresas-seguro-de-vida-empresas', _type: 'reference' },
            { _key: 'r6', _ref: 'producto-empresas-seguro-de-sepelio', _type: 'reference' },
            { _key: 'r7', _ref: 'producto-empresas-integral-de-consorcio', _type: 'reference' },
            { _key: 'r8', _ref: 'producto-empresas-integral-de-comercio', _type: 'reference' },
            { _key: 'r9', _ref: 'producto-empresas-responsabilidad-civil', _type: 'reference' },
            { _key: 'r10', _ref: 'producto-empresas-incendio', _type: 'reference' },
            { _key: 'r11', _ref: 'producto-empresas-aeronavegacion', _type: 'reference' },
            { _key: 'r12', _ref: 'producto-empresas-hecho-por-humanos', _type: 'reference' },
          ],
        },
        {
          _key: 'cta001',
          _type: 'seccionCta',
          titulo: 'Tu empresa crece. Su cobertura tambi\u00e9n.',
          tituloMobile: 'Tu empresa crece. Su cobertura tambi\u00e9n.',
          descripcion: 'Empresas de todos los tama\u00f1os eligen Woranz para operar tranquilas.',
          teamCount: '+9',
          teamLabel: 'personas para ayudarte',
          ctaPrimario: { label: 'Ped\u00ed tu propuesta' },
          ctaSecundario: { label: 'Agend\u00e1 una llamada \u2192' },
        },
      ],
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
        { _key: 'feat-0', icono: 'briefcase', texto: 'Portal para productores' },
        { _key: 'feat-1', icono: 'zap', texto: 'Comisiones al instante' },
        { _key: 'feat-2', icono: 'credit-card', texto: 'Pagos online' },
      ],
      ctaPrimario: { label: 'Empezar gratis' },
      ctaSecundario: { label: 'Conoc\u00e9 el portal \u2192' },
      secciones: [
        {
          _key: 'cta001',
          _type: 'seccionCta',
          titulo: 'Tu cartera, en un solo lugar.',
          tituloMobile: 'Tu cartera en un solo lugar.',
          descripcion: 'Cotiz\u00e1 para tus clientes en segundos. Gestion\u00e1 renovaciones, emisiones y cobranzas sin complicaciones.',
          teamCount: '+21',
          teamLabel: 'personas apoy\u00e1ndote',
          ctaPrimario: { label: 'Empezar gratis' },
          ctaSecundario: { label: 'Habl\u00e1 con nosotros \u2192' },
        },
      ],
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
