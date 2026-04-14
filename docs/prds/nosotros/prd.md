# PRD: TD-020 — Página Nosotros

Status: `ready`
Owner: Product
Prioridad: P0

---

## Product Preflight

| Check | Result |
|-------|--------|
| Stage | Product — scope, content, structure |
| Segments affected | Global (no segment-specific) |
| Sanity impact | New document type `paginaNosotros` or fields in `settings` |
| Frontend impact | Replace placeholder in `app/nosotros/page.tsx` |
| Dependencies | TD-010 (SEO strategy) for metadata contract |
| Blocking questions | None remaining |

---

## 1. Objective

Crear la página institucional "Nosotros" que hoy es un placeholder. La página debe comunicar quién es Woranz, por qué existe, qué la diferencia, y generar confianza con datos verificables y tono de marca.

### Success metrics

- La página existe como destino real desde header y footer
- El contenido es editable desde Sanity
- La narrativa es consistente con el tono Woranz (directo, humano, sin corporate speak)
- Incluye datos duros que generan confianza (años, presencia, regulación)

---

## 2. Scope

### In scope

- Definición de secciones y contenido
- Schema de Sanity para contenido editable
- Contenido inicial (draft para cargar en CMS)
- Política SEO (alineada con TD-010)
- Estructura responsive

### Non-goals

- Sección de equipo / miembros (decisión del usuario)
- Blog o novedades institucionales
- Página de careers (es ruta separada: `/trabaja-con-nosotros`)
- Investor relations / información financiera

---

## 3. Content Audit

### 3.1 Fuentes de investigación

| Fuente | Datos extraídos |
|--------|----------------|
| LinkedIn company page | Fundada 2012 (registro), ~25 empleados, dirección, especialidades |
| TodoRiesgo (abril 2025) | Oyarzabal como Gerente General, fundación operativa 2017, crecimiento +300% en caución, top 15 en emisión |
| 100%Seguro (julio 2021) | Rebranding de FOMS a Woranz (SSN Resolución 115/2021, feb 2021) |
| 100%Seguro (abril 2024) | Expansión a NEA, oficinas en 7 ciudades |
| 100%Seguro (julio 2025) | Expansión a seguros de personas (vida, AP, sepelio) |
| TodoRiesgo (julio 2022) | Woranz Live, alianza Disney+, programa de innovación con productores |

### 3.2 Hechos verificables para la página

| Dato | Fuente | Usar |
|------|--------|------|
| Operando desde 2017 | TodoRiesgo, abril 2025 | Sí |
| Rebranding a Woranz en 2021 | 100%Seguro, SSN Res. 115/2021 | Sí (implícito) |
| Top 15 en emisión de caución en Argentina | TodoRiesgo, abril 2025 | Sí |
| Crecimiento +300% en caución | TodoRiesgo, abril 2025 | Sí |
| Presencia en 7+ ciudades | 100%Seguro, abril 2024 | Sí |
| Regulada por SSN | Público | Sí |
| Gonzalo Oyarzabal, Presidente | 100%Seguro, julio 2025 | No (sin sección equipo) |

### 3.3 Sanity actual

No existe schema para la página Nosotros. El contenido actual es un placeholder hardcodeado.

---

## 4. Page Structure

### Section 1 — Hero institucional

**Propósito**: Declarar identidad en una frase.

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Eyebrow | `Nosotros` | No (estático) |
| Título | `Personas trabajando con personas` | Sí |
| Bajada | `Somos una compañía de seguros que combina procesos simples con personas reales. No elegimos entre tecnología y atención: usamos las dos.` | Sí |

### Section 2 — Nuestra historia

**Propósito**: Dar contexto de dónde viene Woranz sin caer en timeline corporativo.

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Título | `De dónde venimos` | Sí |
| Cuerpo | Rich text (portable text) | Sí |

**Draft del cuerpo:**

> Arrancamos en 2017 con una idea clara: que contratar un seguro no tenía por qué ser complicado. Empezamos en caución, aprendimos el negocio desde adentro, y fuimos creciendo con cada productor y cada cliente que confió en nosotros.
>
> En 2021 cambiamos de nombre y de marca, pero no de forma de trabajar. Hoy operamos en todo el país, con coberturas que van desde garantías de alquiler hasta seguros de vida colectivo.
>
> Lo que no cambió es lo que nos importa: responder cuando alguien nos necesita.

### Section 3 — Números / Hitos

**Propósito**: Generar confianza con datos concretos. Sin gráficos, solo cifras grandes.

| Stat | Valor draft | Label draft | Editable en Sanity |
|------|------------|------------|-------------------|
| Stat 1 | `2017` | `Operando desde` | Sí |
| Stat 2 | `+300%` | `Crecimiento en caución` | Sí |
| Stat 3 | `Top 15` | `En emisión de caución en Argentina` | Sí |
| Stat 4 | `7+` | `Ciudades con presencia` | Sí |

Implementar como array de objetos `{ valor, label }` en Sanity para que marketing pueda agregar, quitar o reordenar.

### Section 4 — Presencia nacional

**Propósito**: Mostrar que no es una empresa solo de Buenos Aires.

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Título | `Presencia en todo el país` | Sí |
| Descripción | `Operamos desde Buenos Aires con oficinas y representaciones en todo el territorio.` | Sí |
| Ciudades | `Buenos Aires, Mar del Plata, Mendoza, San Juan, San Luis, Neuquén, Corrientes` | Sí (array de strings) |

**Nota de diseño**: No hace falta un mapa interactivo. Una lista con las ciudades o una grilla simple es suficiente. El diseñador UI decide la forma visual.

### Section 5 — Regulación / Respaldo

**Propósito**: Cerrar con la señal de confianza más fuerte: regulación.

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Título | `Compañía regulada` | Sí |
| Cuerpo | `Woranz Compañía de Seguros S.A. está autorizada y regulada por la Superintendencia de Seguros de la Nación (SSN). Cada póliza que emitimos tiene respaldo real y cumple con la normativa vigente.` | Sí |
| Número de matrícula SSN | `867` | Sí |

### Section 6 — CTA de cierre

**Propósito**: Darle al usuario un siguiente paso.

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Título | `¿Querés saber más?` | Sí |
| CTA primario | `Ver coberturas` → `/personas` | Sí (href configurable) |
| CTA secundario | `Hablar con alguien` → WhatsApp/contacto | Sí (href configurable) |

---

## 5. Sanity Schema

### Document type `paginaInstitucional`

Crear un document type genérico reutilizable para páginas institucionales (Nosotros, Contacto, FAQ, etc.). Cada página es un documento distinto identificado por `slug`.

```
paginaInstitucional (document)
├── titulo           (string) — nombre interno del documento
├── slug             (slug) — ruta: "nosotros", "contacto", "faq"
├── secciones        (array of section blocks — ver abajo)
├── seo              (seo object — from TD-010)
```

**Section blocks disponibles** (portable, reordenables):

```
heroInstitucional    — { eyebrow?, titulo, bajada }
bloqueTexto          — { titulo, cuerpo (portableText) }
stats                — { items: array of { valor, label } }
listaCiudades        — { titulo, descripcion, ciudades: array of string }
bloqueRespaldo       — { titulo, cuerpo (text), matriculaSSN? }
bloqueCta            — { titulo, ctaPrimarioLabel, ctaPrimarioHref, ctaSecundarioLabel?, ctaSecundarioHref? }
```

**Ventajas**: escala a todas las páginas institucionales, no sobrecarga `settings`, las secciones son reordenables desde Sanity.

Para la página Nosotros, el documento se carga con las secciones definidas en Section 4 de este PRD.

---

## 6. SEO (aligned with TD-010)

| Field | Value |
|-------|-------|
| Title | `Nosotros — Woranz` (override via Sanity `seo.seoTitle`) |
| Description | `Somos una compañía de seguros que combina procesos simples con personas reales. Operamos en todo el país desde 2017.` |
| Robots | `index, follow` |
| Canonical | `https://woranz.com/nosotros` |
| OG image | Default brand OG image |
| JSON-LD | `Organization` (same as global, no page-specific additions) |

---

## 7. Acceptance Criteria

1. [ ] Página `/nosotros` accesible y funcional (reemplaza placeholder)
2. [ ] Header y footer apuntan al destino real (ya lo hacen)
3. [ ] 6 secciones implementadas: hero, historia, stats, presencia, respaldo, CTA
4. [ ] Todo el contenido es editable desde Sanity
5. [ ] Contenido inicial cargado en Sanity (draft de este PRD)
6. [ ] Metadata SEO completa (title, description, OG, canonical, robots)
7. [ ] Responsive: funciona en desktop y mobile
8. [ ] Tono validado contra woranz-copy skill

---

## Heuristic Audit

| Heuristic | Risk | Assessment |
|-----------|------|------------|
| **Match between system and domain** | Medium | El contenido debe sonar a Woranz, no a "empresa genérica de seguros". El draft usa el tono de los homes. Validar con woranz-copy. |
| **Consistency and standards** | Low | La estructura (hero → contenido → stats → CTA) sigue el patrón de las homes. |
| **Recognition rather than recall** | Low | Página informativa sin interacción compleja. |
| **Affordances and signifiers** | Low | Solo CTAs al final. Deben ser visualmente claros. |
| **Figure and ground** | Medium | La sección de stats puede competir visualmente con la narrativa. El diseñador UI debe jerarquizar: la historia es la pieza central, los números son soporte. |

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | No incluir sección de equipo | Decisión del usuario. El schema `miembroEquipo` existe en Sanity pero no se usa en esta página. |
| D2 | Document type `paginaInstitucional` genérico | Reutilizable para nosotros, contacto, FAQ y futuras páginas. Evita sobrecargar `settings`. Secciones como blocks reordenables. |
| D3 | Sin mapa interactivo para presencia | Una lista de ciudades es suficiente. Evita dependencias de mapas y complejidad de UI innecesaria. |
| D4 | Stats como array editable | Marketing puede agregar/quitar/reordenar números sin deploy. |
| D5 | Año de fundación = 2017 (operativo), no 2012 (registro) | 2017 es cuando la empresa empezó a operar. 2012 es el registro societario de FOMS. Fuente: TodoRiesgo, abril 2025. |

---

## Blocking Questions by Stage

### For UI

1. **Stats layout**: ¿grilla de 4 columnas, o fila horizontal? El diseñador decide, pero la data es array de `{ valor, label }`.
2. **Presencia nacional**: ¿lista plana, chips, o algo visual? Sin mapa, pero el formato queda abierto.
3. **Imagen hero**: ¿ilustración generada (woranz-images) o solo texto? La página es institucional, no de producto.

### For Frontend

4. **Número de matrícula SSN**: necesitamos el dato real para la sección de respaldo. Confirmar con el usuario.
5. **Schema `paginaInstitucional`**: confirmado — document type genérico reutilizable con section blocks.

### For Content

6. **Revisión del draft**: el contenido de la sección "historia" y "stats" debe ser validado por el equipo antes de publicar.

---

## Product Postflight

| Check | Result |
|-------|--------|
| Objective clear | Yes — página institucional con narrativa y datos |
| Scope bounded | Yes — 6 secciones, sin equipo, sin mapa |
| Non-goals explicit | Yes — no equipo, no careers, no blog |
| Content requirements defined | Yes — cada sección con campos y drafts |
| Sanity schema proposed | Yes — Option A en settings, con override disponible |
| Acceptance criteria testable | Yes — 8 criterios verificables |
| Heuristic audit done | Yes — 5 heuristics assessed |
| Decision log populated | Yes — 5 decisions recorded |
| Blocking questions identified | Yes — 6 questions for downstream stages |
