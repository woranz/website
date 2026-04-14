# PRD: TD-021 — Página Contacto

Status: `ready`
Owner: Product
Prioridad: P0

---

## Product Preflight

| Check | Result |
|-------|--------|
| Stage | Product — scope, content, structure |
| Segments affected | Global (no segment-specific) |
| Sanity impact | Usa `paginaInstitucional` (definido en TD-020) + nuevos block types para formulario y datos de contacto |
| Frontend impact | Replace placeholder en `app/contacto/page.tsx`, integrar SendGrid para form |
| Dependencies | TD-020 (schema `paginaInstitucional`), TD-010 (SEO) |
| Blocking questions | None remaining |

---

## 1. Objective

Crear la página de contacto que hoy es un placeholder. Debe ofrecer un formulario funcional (con motivo: contacto/soporte/reclamos) y canales directos (email, teléfono, dirección). Sin WhatsApp (varía por producto).

### Success metrics

- La página existe como destino real desde header y footer
- El formulario envía emails via SendGrid con el motivo seleccionado
- Los canales directos son visibles y claros
- El contenido es editable desde Sanity

---

## 2. Scope

### In scope

- Formulario de contacto con select de motivo
- Canales directos (email, teléfono, dirección)
- Envío via SendGrid
- Schema en Sanity (reutiliza `paginaInstitucional` de TD-020)
- SEO (alineado con TD-010)

### Non-goals

- WhatsApp (cambia por producto, no va en contacto general)
- Chat en vivo / chatbot
- Mapa embebido (Google Maps)
- Sistema de tickets / CRM integration
- Horarios de atención

---

## 3. Content Audit

### 3.1 Datos de contacto existentes

| Dato | Fuente | Valor |
|------|--------|-------|
| Email | woranz.com actual | info@woranz.com |
| Teléfono | woranz.com actual | 0800-266-4240 |
| Dirección | LinkedIn / woranz.com | Av. Rivadavia 611, Piso 5, CABA |
| WhatsApp | `lib/site-links.ts` | Excluido de esta página |

### 3.2 Sanity actual

`settings` ya tiene `contactoTitulo`, `contactoSubtitulo`, `whatsappNumero`, `emailContacto`. Estos campos se mantienen para uso global (CTAs en productos, footer), pero la página de contacto usa el document type `paginaInstitucional`.

### 3.3 SendGrid

Ya existe integración con SendGrid en el proyecto (`lib/email/`). El formulario reutiliza esa infraestructura.

---

## 4. Page Structure

### Section 1 — Hero

| Campo | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Eyebrow | `Contacto` | No (estático) |
| Título | `Hablemos` | Sí |
| Bajada | `Si tenés una consulta, necesitás soporte o querés hacer un reclamo, estamos del otro lado.` | Sí |

### Section 2 — Formulario + Canales (layout a dos columnas)

**Columna izquierda: Formulario**

| Campo del form | Tipo | Requerido | Notas |
|----------------|------|-----------|-------|
| Motivo | Select | Sí | Opciones: `Consulta comercial`, `Soporte`, `Reclamo` |
| Nombre | Text input | Sí | |
| Email | Email input | Sí | Validación de formato |
| Teléfono | Tel input | No | Opcional |
| Mensaje | Textarea | Sí | |
| Enviar | Submit button | — | Label: `Enviar mensaje` |

**Opciones del select editables desde Sanity** (array de `{ label, value }`). Draft:

```
[
  { label: "Consulta comercial", value: "comercial" },
  { label: "Soporte", value: "soporte" },
  { label: "Reclamo", value: "reclamo" }
]
```

**Columna derecha: Canales directos**

| Canal | Contenido draft | Editable en Sanity |
|-------|----------------|-------------------|
| Email | info@woranz.com | Sí |
| Teléfono | 0800-266-4240 | Sí |
| Dirección | Av. Rivadavia 611, Piso 5, CABA, Argentina | Sí |

Cada canal se muestra con ícono + label + valor clickeable (mailto:, tel:, link a Google Maps).

### Section 3 — Estado del formulario

| Estado | Comportamiento |
|--------|---------------|
| Idle | Formulario visible, listo para completar |
| Submitting | Botón en loading, campos deshabilitados |
| Success | Mensaje de confirmación inline: "Tu mensaje fue enviado. Te vamos a responder lo antes posible." |
| Error | Mensaje de error inline: "No pudimos enviar tu mensaje. Intentá de nuevo o escribinos a info@woranz.com." |

No redirigir a página de éxito. El feedback es inline.

---

## 5. Email Routing (SendGrid)

### 5.1 Lógica de envío

| Motivo | Destinatario | Subject template |
|--------|-------------|-----------------|
| `comercial` | info@woranz.com | `[Web - Comercial] {nombre}` |
| `soporte` | info@woranz.com | `[Web - Soporte] {nombre}` |
| `reclamo` | info@woranz.com | `[Web - Reclamo] {nombre}` |

**Nota**: todos van al mismo email hoy. Si en el futuro quieren rutear a distintas casillas por motivo, solo cambian la config.

### 5.2 Email contenido

```
Motivo: {motivo}
Nombre: {nombre}
Email: {email}
Teléfono: {telefono || "No proporcionado"}

Mensaje:
{mensaje}
```

### 5.3 Confirmación al usuario

No enviar email de confirmación al usuario (evita spam). Solo feedback inline en la página.

---

## 6. Sanity Schema

Reutiliza `paginaInstitucional` de TD-020. Se agregan dos block types nuevos:

```
formularioContacto (section block)
├── motivos            (array of { label: string, value: string })
├── destinatarioEmail  (string) — email donde llegan los mensajes
├── subjectPrefix      (string) — prefijo del subject, default "[Web]"

datosContacto (section block)
├── email              (string)
├── telefono           (string)
├── direccion          (text)
├── direccionGmapsUrl  (url) — link a Google Maps (opcional)
```

El documento `paginaInstitucional` para contacto se arma con:
1. `heroInstitucional`
2. `formularioContacto` + `datosContacto` (renderizados como layout de dos columnas)

---

## 7. SEO (aligned with TD-010)

| Field | Value |
|-------|-------|
| Title | `Contacto — Woranz` |
| Description | `Escribinos por consultas comerciales, soporte o reclamos. Estamos en Av. Rivadavia 611, CABA.` |
| Robots | `index, follow` |
| Canonical | `https://woranz.com/contacto` |
| OG image | Default brand OG image |
| JSON-LD | `ContactPage` + `Organization` con contactPoint (phone, email) |

---

## 8. Legacy Redirects

| Legacy URL | New URL | Notes |
|------------|---------|-------|
| `/contacto/` | `/contacto` | Direct |
| `/contacto-2/` | `/contacto` | Duplicate |
| `/contacto-web/` | `/contacto` | Form variant |
| `/reclamos/` | `/contacto` | Merged — form motivo "Reclamo" |
| `/siniestros-y-reclamos/` | `/contacto` | Merged |
| `/consulta-por-coberturas/` | `/contacto` | Merged |

---

## 9. Acceptance Criteria

1. [ ] Página `/contacto` accesible y funcional (reemplaza placeholder)
2. [ ] Header y footer apuntan al destino real (ya lo hacen)
3. [ ] Formulario con campos: motivo (select), nombre, email, teléfono (opcional), mensaje
4. [ ] Select de motivo con opciones editables desde Sanity
5. [ ] Envío funcional via SendGrid con routing por motivo
6. [ ] Estados del formulario: idle, submitting, success, error (todos inline)
7. [ ] Canales directos visibles: email, teléfono, dirección
8. [ ] Canales clickeables (mailto:, tel:, Google Maps link)
9. [ ] Contenido editable desde Sanity
10. [ ] Metadata SEO completa
11. [ ] Responsive: formulario y canales funcionan en mobile (stack vertical)
12. [ ] Validación: campos requeridos, formato de email

---

## Heuristic Audit

| Heuristic | Risk | Assessment |
|-----------|------|------------|
| **Visibility of system status** | High | El formulario DEBE tener feedback claro en cada estado (submitting, success, error). Sin eso, el usuario no sabe si su mensaje se envió. |
| **Error prevention** | Medium | Validar email format y campos requeridos antes del submit. Motivo como select (no free text) previene entradas ambiguas. |
| **Match between system and domain** | Low | "Consulta comercial / Soporte / Reclamo" son categorías que el usuario entiende sin jerga. |
| **User control and freedom** | Low | Formulario simple, sin pasos. El usuario puede corregir antes de enviar. |
| **Consistency and standards** | Medium | El formulario debe usar los mismos inputs de `components/ui/` que los cotizadores. No inventar un estilo nuevo de form. |

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Sin WhatsApp en la página de contacto | El número varía por producto. Exponer uno genérico genera expectativas incorrectas. WhatsApp sigue disponible desde páginas de producto. |
| D2 | Todos los motivos van al mismo email (info@woranz.com) | Simplifica el setup inicial. El motivo va en el subject para filtrado manual. Si necesitan routing a casillas distintas, solo cambian config en Sanity. |
| D3 | Feedback inline, sin página de éxito | Evita una redirección innecesaria. El usuario ve el resultado donde completó el form. Menos rutas, menos mantenimiento. |
| D4 | Sin email de confirmación al usuario | Evita complejidad y potencial spam. Si lo necesitan después, se agrega. |
| D5 | Teléfono opcional en el formulario | No todos quieren dejar su teléfono. El email es suficiente para responder. |
| D6 | Reutiliza `paginaInstitucional` de TD-020 | Mismo document type con block types nuevos (`formularioContacto`, `datosContacto`). Coherente con la arquitectura decidida. |

---

## Blocking Questions by Stage

### For UI

1. **Layout dos columnas**: formulario a la izquierda, canales a la derecha. ¿O al revés? El diseñador decide, pero el formulario es la acción principal.
2. **Canales con íconos**: ¿usar íconos de Lucide (mail, phone, map-pin) o algo custom?

### For Frontend

3. **Rate limiting**: el formulario necesita protección contra spam. ¿Honeypot field, o rate limit en el API route?
4. **API route**: crear `app/api/contacto/route.ts` para procesar el form y enviar via SendGrid.

---

## Product Postflight

| Check | Result |
|-------|--------|
| Objective clear | Yes — página de contacto con formulario + canales directos |
| Scope bounded | Yes — sin WhatsApp, sin chat, sin mapa, sin CRM |
| Non-goals explicit | Yes — 5 non-goals listados |
| Content requirements defined | Yes — cada campo con draft y source of truth |
| Sanity schema proposed | Yes — reutiliza `paginaInstitucional` + 2 block types nuevos |
| Acceptance criteria testable | Yes — 12 criterios verificables |
| Heuristic audit done | Yes — 5 heuristics assessed |
| Decision log populated | Yes — 6 decisions recorded |
| Blocking questions identified | Yes — 4 questions for downstream stages |
