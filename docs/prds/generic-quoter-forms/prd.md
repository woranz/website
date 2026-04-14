# PRD: Cotizadores Inline con Pricing en Tiempo Real

**IDs de backlog:** HGF-003, RBP-001, RCP-002, RNP-002, INF-002
**Stage:** Product
**Estado:** Ready
**Fecha:** 2026-04-13

---

## Product Preflight

| Check | Result |
|-------|--------|
| Stage | `Product` — problem framing, scope, pricing formulas for 5 inline quoters |
| Segments | `personas` (hogar, robo-bici, robo-celular, robo-notebook, incendio) |
| Prerequisite | TD-015 (generic form system) — **Done** |
| Referencia de patrón | Cotizador de Caución Alquiler (`CaucionQuoter.tsx`) — pricing client-side con AnimatedPrice |
| Product catalog | 5 productos definidos con `"modo": "contacto"` — **cambiar a nuevo modo inline** |
| Sanity schema | Necesita nuevo `modo` por producto o modo genérico configurable |

**Verdict:** `safe to proceed` — el patrón de caución alquiler es replicable. Se necesitan fórmulas de pricing y campos por producto.

---

## Objective

Dar a cada producto sin cotizador un **pricing inline en tiempo real** al estilo del cotizador de caución alquiler: el usuario ingresa parámetros, ve el precio al instante, y puede avanzar a contratar.

### Por qué ahora

- 5 product pages no tienen cotizador — el usuario no puede saber cuánto cuesta sin contactar.
- La competencia (Iúnigo, 123Seguro, Sancor, Seguron) ya ofrece cotización online instantánea.
- El patrón de CaucionQuoter.tsx prueba que el pricing client-side funciona bien en Woranz.
- Las fórmulas iniciales se calibran con data de competencia y se ajustan después.

---

## Scope

### In Scope

- 5 cotizadores inline con pricing client-side (uno por producto)
- Fórmulas de pricing por producto (calibradas con benchmarks de competencia)
- Componentes de cotizador siguiendo el patrón de CaucionQuoter
- CTA post-cotización que lleva a formulario de preaprobación/contacto
- Email routing por producto

### Segments

| Producto | Segmento | Slug |
|----------|----------|------|
| Seguro de Hogar | personas | `seguro-de-hogar` |
| Robo de Bici | personas | `robo-bici` |
| Robo de Celular | personas | `robo-celular` |
| Robo de Notebook | personas | `robo-notebook` |
| Incendio | personas | `incendio` |

### Non-Goals

- **No integración con API de pricing backend.** Las fórmulas son client-side, como caución alquiler. Si en el futuro se integra una API real, se reemplaza la función `calculatePrice`.
- **No multi-step wizard en el cotizador.** El cotizador es single-view. El formulario de datos personales es un paso posterior (preaprobación).
- **No upload de archivos.** Fotos/facturas se piden post-contacto.

---

## Arquitectura del Cotizador

### Patrón (replica CaucionQuoter.tsx)

```
[Sección Cotizador en Product Page]
    ├── Inputs del producto (tipo, valor, m², etc.)
    ├── AnimatedPrice (precio calculado en real-time)
    └── CTA → /personas/coberturas/{slug}/contratacion?{params}

[Página de Contratación]  (form builder)
    ├── Resumen de la cotización (params del URL → precio, producto, factores)
    ├── Formulario de datos personales (nombre, email, tel, comentarios)
    └── Submit → POST /api/forms/submit → Email a patrimoniales@woranz.com
```

### Flujo de Usuario

```
1. Usuario llega a product page
2. Ve el cotizador con campos específicos del producto
3. Completa los campos → precio se actualiza en real-time (AnimatedPrice)
4. Click CTA "Contratar" / "Solicitar"
5. Navega a /contratacion con params de cotización en URL
6. Ve resumen de su cotización + formulario de datos personales (form builder)
7. Completa datos y envía
8. Email a patrimoniales@woranz.com con cotización + datos personales
9. Pantalla de éxito
```

---

## Fórmulas de Pricing por Producto

> **Nota:** Estas fórmulas son estimaciones iniciales basadas en benchmarks de competencia argentina (abril 2026). Están diseñadas para ser ajustadas sin cambiar la arquitectura.

---

### 1. Seguro de Hogar (`seguro-de-hogar`)

**Benchmark:** Allianz, Sancor, BBVA — $15.000-$70.000/mes según cobertura y m².

#### Inputs del cotizador

| Campo | Tipo | Required | Opciones |
|-------|------|----------|----------|
| Tipo de vivienda | `select` | ✅ | Casa / Departamento / PH |
| Condición | `select` | ✅ | Propietario / Inquilino |
| Metros cuadrados | `number` | ✅ | min: 20, max: 500 |
| Provincia | `provincia-select` | ✅ | — |

#### Fórmula

```typescript
const HOGAR_BASE_PER_M2 = 250 // $/m²/mes

const HOGAR_TIPO_FACTOR = {
  casa: 1.0,
  departamento: 0.85,
  ph: 1.1,
}

const HOGAR_CONDICION_FACTOR = {
  propietario: 1.0,
  inquilino: 0.7,
}

function calculateHogarPrice({ m2, tipo, condicion, provincia }) {
  const base = m2 * HOGAR_BASE_PER_M2
  const tipoFactor = HOGAR_TIPO_FACTOR[tipo]
  const condicionFactor = HOGAR_CONDICION_FACTOR[condicion]
  const impuestoProvincial = getProvinceTaxRate(provincia) // reuse from caucion
  
  const subtotal = base * tipoFactor * condicionFactor
  const total = subtotal * (1 + impuestoProvincial)
  
  return Math.round(total)
}
```

#### Ejemplos de precio resultante

| Caso | Precio/mes |
|------|-----------|
| Depto 50m², inquilino, CABA | ~$8.900 |
| Casa 80m², propietario, CABA | ~$21.200 |
| Casa 120m², propietario, Bs.As. | ~$31.800 |
| PH 60m², propietario, CABA | ~$17.600 |

**Email preaprobación:** `patrimoniales@woranz.com`

---

### 2. Robo de Bici (`robo-bici`)

**Benchmark:** Seguron, SeguroBici, Fed. Patronal — ~1.5-2.5% del valor/mes.

#### Inputs del cotizador

| Campo | Tipo | Required | Opciones |
|-------|------|----------|----------|
| Tipo de bicicleta | `select` | ✅ | Mountain bike / Playera / Plegable / Eléctrica / Monopatín |
| Valor aproximado | `number` | ✅ | min: 50.000, max: 5.000.000, placeholder: "Ej: 500.000" |

#### Fórmula

```typescript
const BICI_TASA_BASE = 0.02 // 2% mensual

const BICI_TIPO_FACTOR = {
  mountain: 1.0,
  playera: 0.9,
  plegable: 0.85,
  electrica: 1.3,
  monopatin: 1.15,
}

function calculateBiciPrice({ valor, tipo }) {
  const tipoFactor = BICI_TIPO_FACTOR[tipo]
  return Math.round(valor * BICI_TASA_BASE * tipoFactor)
}
```

#### Ejemplos de precio resultante

| Caso | Precio/mes |
|------|-----------|
| Mountain bike $300.000 | $6.000 |
| Eléctrica $800.000 | $20.800 |
| Playera $150.000 | $2.700 |
| Monopatín $500.000 | $11.500 |

**Email preaprobación:** `patrimoniales@woranz.com` — pendiente confirmación

---

### 3. Robo de Celular (`robo-celular`)

**Benchmark:** Segurocell, Naranja X, Zigler — ~1.5-2% del valor/mes.

#### Inputs del cotizador

| Campo | Tipo | Required | Opciones |
|-------|------|----------|----------|
| Marca | `searchable-select` | ✅ | Apple / Samsung / Motorola / Xiaomi / Otro (con buscador) |
| Valor aproximado | `number` | ✅ | min: 50.000, max: 3.000.000, placeholder: "Ej: 800.000" |

#### Fórmula

```typescript
const CELULAR_TASA_BASE = 0.018 // 1.8% mensual

const CELULAR_MARCA_FACTOR = {
  apple: 1.2,
  samsung: 1.0,
  motorola: 0.9,
  xiaomi: 0.85,
  otro: 1.0,
}

function calculateCelularPrice({ valor, marca }) {
  const marcaFactor = CELULAR_MARCA_FACTOR[marca]
  return Math.round(valor * CELULAR_TASA_BASE * marcaFactor)
}
```

#### Ejemplos de precio resultante

| Caso | Precio/mes |
|------|-----------|
| iPhone $1.500.000 | $32.400 |
| Samsung $800.000 | $14.400 |
| Motorola $400.000 | $6.480 |
| Xiaomi $300.000 | $4.590 |

**Email preaprobación:** `patrimoniales@woranz.com` — pendiente confirmación

---

### 4. Robo de Notebook (`robo-notebook`)

**Benchmark:** Sancor, BBVA, Zurich, La Caja — ~2-5% del valor/mes.

#### Inputs del cotizador

| Campo | Tipo | Required | Opciones |
|-------|------|----------|----------|
| Marca | `searchable-select` | ✅ | Apple / Lenovo / HP / Dell / ASUS / Otro (con buscador) |
| Valor aproximado | `number` | ✅ | min: 100.000, max: 5.000.000, placeholder: "Ej: 1.200.000" |

#### Fórmula

```typescript
const NOTEBOOK_TASA_BASE = 0.025 // 2.5% mensual

const NOTEBOOK_MARCA_FACTOR = {
  apple: 1.15,
  lenovo: 1.0,
  hp: 1.0,
  dell: 1.0,
  asus: 0.95,
  otro: 1.0,
}

function calculateNotebookPrice({ valor, marca }) {
  const marcaFactor = NOTEBOOK_MARCA_FACTOR[marca]
  return Math.round(valor * NOTEBOOK_TASA_BASE * marcaFactor)
}
```

#### Ejemplos de precio resultante

| Caso | Precio/mes |
|------|-----------|
| MacBook $2.000.000 | $57.500 |
| Lenovo $800.000 | $20.000 |
| HP $600.000 | $15.000 |
| ASUS $500.000 | $11.875 |

**Email preaprobación:** `patrimoniales@woranz.com` — pendiente confirmación

---

### 5. Incendio (`incendio`)

**Benchmark:** Fed. Patronal, La Segunda, Sancor — 0.1-0.3% anual del valor del inmueble. Inquilinos: 1.2-2.3% del alquiler mensual.

#### Inputs del cotizador

| Campo | Tipo | Required | Opciones |
|-------|------|----------|----------|
| Condición | `select` | ✅ | Propietario / Inquilino |
| Tipo de inmueble | `select` | ✅ | Casa / Departamento / PH / Local comercial |
| Metros cuadrados | `number` | ✅ | min: 15, max: 1000 |
| Provincia | `provincia-select` | ✅ | — |

#### Fórmula

```typescript
const INCENDIO_BASE_PER_M2 = 100 // $/m²/mes (más barato que hogar — solo incendio)

const INCENDIO_TIPO_FACTOR = {
  casa: 1.0,
  departamento: 0.8,
  ph: 1.1,
  local_comercial: 1.3,
}

const INCENDIO_CONDICION_FACTOR = {
  propietario: 1.0,
  inquilino: 0.6,
}

function calculateIncendioPrice({ m2, tipo, condicion, provincia }) {
  const base = m2 * INCENDIO_BASE_PER_M2
  const tipoFactor = INCENDIO_TIPO_FACTOR[tipo]
  const condicionFactor = INCENDIO_CONDICION_FACTOR[condicion]
  const impuestoProvincial = getProvinceTaxRate(provincia)
  
  const subtotal = base * tipoFactor * condicionFactor
  const total = subtotal * (1 + impuestoProvincial)
  
  return Math.round(total)
}
```

#### Ejemplos de precio resultante

| Caso | Precio/mes |
|------|-----------|
| Depto 50m², inquilino, CABA | ~$2.540 |
| Casa 80m², propietario, CABA | ~$8.480 |
| Local 100m², propietario, Bs.As. | ~$13.780 |
| PH 60m², inquilino, CABA | ~$3.740 |

**Email preaprobación:** `patrimoniales@woranz.com`

---

## Componentes Compartidos

### Province Tax Rates

Reutilizar el array `PROVINCIAS` de `CaucionQuoter.tsx` que ya tiene tasas impositivas por provincia.

### AnimatedPrice

Reutilizar el componente `AnimatedPrice` de caución alquiler (300ms ease-out).

### Responsive

Cada cotizador necesita versión Desktop y Mobile, siguiendo el patrón de `CaucionQuoterDesktop` / `CaucionQuoterMobile`.

### Formulario de Contratación (Form Builder)

Post-cotización, el CTA lleva a `/personas/coberturas/{slug}/contratacion?{params}`. Este form se arma con el **form builder existente** (`lib/forms/`), igual que cauciones-tradicionales.

Los parámetros de la cotización (valor, tipo, m², precio calculado) viajan en la URL y se muestran como **resumen de la cotización** arriba del formulario.

#### Form configs de contratación (uno por producto)

Todos comparten los mismos campos base:

| Campo | Tipo | Required |
|-------|------|----------|
| Nombre completo | `text` | ✅ |
| Email | `email` | ✅ |
| Teléfono | `tel` | ✅ |
| Comentarios | `textarea` | |

Cada form config se registra en `lib/forms/configs/` y `lib/forms/registry.ts`:

| ID del form config | Producto | Destinatario | Subject Template |
|-------------------|----------|-------------|-----------------|
| `seguro-de-hogar` | Seguro de Hogar | `patrimoniales@woranz.com` | `Contratación Seguro de Hogar — {{nombre}}` |
| `incendio` | Incendio | `patrimoniales@woranz.com` | `Contratación Seguro de Incendio — {{nombre}}` |
| `robo-bici` | Robo de Bici | `patrimoniales@woranz.com` | `Contratación Robo de Bici — {{nombre}}` |
| `robo-celular` | Robo de Celular | `patrimoniales@woranz.com` | `Contratación Robo de Celular — {{nombre}}` |
| `robo-notebook` | Robo de Notebook | `patrimoniales@woranz.com` | `Contratación Robo de Notebook — {{nombre}}` |

#### Éxito post-submit

- **Título:** "¡Solicitud enviada!"
- **Descripción:** "Recibimos tus datos. Te contactamos en menos de 24hs."

---

## Acceptance Criteria

### Funcional

1. Cada producto muestra un cotizador inline con los campos definidos arriba.
2. El precio se actualiza en real-time al cambiar cualquier input (AnimatedPrice).
3. El CTA lleva a la página de preaprobación con los params de la cotización en la URL.
4. El formulario de preaprobación envía email al destinatario correcto.
5. El usuario ve pantalla de éxito post-submit.

### Técnico

6. Cada cotizador tiene su función `calculateXPrice` con constantes extraídas (fácil de ajustar).
7. Las constantes de pricing están separadas de la lógica de render (archivo de constantes o top-level).
8. Se reutilizan `AnimatedPrice`, `PROVINCIAS`, y el patrón responsive de CaucionQuoter.
9. Agregar type `number` a `FormFieldType` en `lib/forms/types.ts`.
10. No se rompe ningún cotizador existente (AP, Caución).

### UX

11. El cotizador se siente inmediato — no hay loading, no hay "espere".
12. Los campos usan lenguaje del usuario: "Valor aproximado", no "Suma asegurada".
13. El precio se muestra con formato moneda: "$12.500/mes".
14. Mobile-first: los inputs se apilan verticalmente, el precio siempre visible.

---

## Heuristic Audit

| Heuristic | Risk | Mitigation |
|-----------|------|------------|
| **Visibility of system status** | Low | AnimatedPrice da feedback instantáneo. No hay loading. |
| **Match between system and domain** | Medium | Usar "Valor aproximado", "Metros cuadrados" — no jerga de seguros. |
| **Error prevention** | Medium | min/max en campos numéricos. Select para opciones cerradas. |
| **Consistency** | Low | Mismo patrón visual que caución alquiler. |
| **User control** | Medium | El cotizador no obliga a completar para ver precio. Cada campo tiene un default razonable excepto valor/m². |
| **Proximity (Gestalt)** | Medium | Inputs agrupados arriba, precio prominente abajo/al lado, CTA debajo del precio. |
| **Constraints** | Low | Los precios irreales (valor $0 o m² negativo) se previenen con min/max HTML nativos. |

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Pricing client-side, no API | Mismo patrón que caución alquiler. Las fórmulas son ajustables sin deploy (constantes separadas). Cuando haya API real, se reemplaza `calculateXPrice`. |
| D2 | Fórmulas basadas en benchmarks de competencia | Calibradas con data pública de Seguron, Segurocell, Sancor, Allianz, Fed. Patronal, etc. (abril 2026). |
| D3 | No upload de archivos | Frena conversión. El comercial los pide post-contacto. |
| D4 | No IMEI/serial en cotizador | Dato técnico que el usuario no tiene a mano. Se pide en preaprobación si es necesario. |
| D5 | Hogar e incendio → patrimoniales@woranz.com | Confirmado por stakeholder. |
| D6 | Todos los productos → patrimoniales@woranz.com | Confirmado por stakeholder. |
| D7 | Reuse AnimatedPrice + PROVINCIAS de CaucionQuoter | No reinventar. Componentes probados en producción. |
| D8 | Cotizador → contratación en dos pasos | El cotizador muestra precio sin pedir datos personales (reduce fricción). Los datos se piden en form de contratación armado con el form builder existente. |
| D9 | Agregar type `number` a FormFieldType | Necesario para m² y valor del bien. Input numérico nativo con min/max. |
| D10 | Un PRD unificado para los 5 | Mismo patrón de cotizador, misma arquitectura, mismos criterios. PRDs separados serían redundantes. |
| D11 | Marca como factor de precio (celu/notebook) | Apple tiene mayor riesgo de robo → prima más alta. Basado en práctica de mercado (Segurocell, Zigler). |

---

## Blocking Questions

### Resueltas

| # | Question | Answer |
|---|----------|--------|
| Q1 | Email routing hogar/incendio | `patrimoniales@woranz.com` ✅ |
| Q2 | SLA / copy de éxito | No aplica — la cotización es instantánea. El copy de éxito es para el form de preaprobación. |
| Q3 | Campos adicionales | Proponer según competencia ✅ |
| Q4 | Componente visual | Mismo patrón que caución alquiler ✅ |
| Q5 | Diferenciación visual | Mismo layout para todos ✅ |
| Q7 | Tipo number | Agregar ✅ |

### Pendientes

| # | Question | Status |
|---|----------|--------|
| Q6 | Email routing para robo-bici, robo-celular, robo-notebook | `patrimoniales@woranz.com` ✅ |

---

## Product Postflight

| Check | Result |
|-------|--------|
| Objective defined | ✅ Cotizadores inline con pricing real-time para 5 productos |
| Scope clear | ✅ 5 cotizadores + preaprobación + email routing |
| Non-goals explicit | ✅ No API backend, no upload, no multi-step |
| Content requirements | ✅ Sanity necesita nuevo modo, product catalog update |
| Pricing formulas | ✅ 5 fórmulas calibradas con benchmarks |
| Acceptance criteria | ✅ 14 criterios (funcional + técnico + UX) |
| Heuristic audit | ✅ 7 heurísticas evaluadas |
| Decision log | ✅ 11 decisiones documentadas |
| Blocking questions | ✅ Todas resueltas |

**Status:** Ready — todas las blocking questions resueltas. Listo para UI/Frontend.
