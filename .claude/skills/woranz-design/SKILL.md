---
name: woranz-design
description: "Sistema de diseño Woranz para Pencil. Usá este skill cada vez que necesites crear, diseñar o modificar páginas del sitio web de Woranz en Pencil. Se activa cuando el usuario menciona 'diseñar', 'crear página', 'nueva sección', 'layout', 'componente', 'landing', 'responsive', 'mobile', 'desktop', 'nueva página', 'sección', o cualquier pedido de diseño en Pencil. También se activa si dice 'armá la página de X', 'hacé el mobile de X', 'agregá una sección', o 'copiá el layout de'."
---

# Woranz Design System — Pencil Workflow

## Scope & Authority

This skill is the **implementation reference for Pencil** — grid, spacing tokens, component specs, typography scale, color palette, and Pencil workflow.

For **process and judgment** (when something is wrong, what passes to run, what questions to ask, when to reject a proposal), use the agent-contract docs in `docs/agent-contract/`. Those docs have precedence for design decisions and quality gates. This skill has precedence for concrete Pencil values and component construction.

Sistema de diseño extraído de v4.pen. Todas las páginas nuevas deben respetar estas reglas para mantener coherencia visual en todo el sitio.

## ⚠️ PASO 0 — Obligatorio antes de cualquier acción

**SIEMPRE leé `../woranz-productos/PRODUCTOS.md` antes de diseñar cualquier página de producto.** Ahí está la definición de cada producto, su público y su mundo visual. Esto define qué secciones priorizar y qué contenido mostrar.

**SIEMPRE consultá v4.pen como referencia viva.** Usá `batch_get` para leer la estructura de páginas existentes antes de crear nuevas. Copiá secciones existentes con `C()` cuando sea posible — es más rápido y más consistente que crear de cero.

---

## Grid & Layout Base

### Desktop (1440px)

| Propiedad | Valor |
|---|---|
| **Ancho de página** | `1440px` |
| **Layout** | `vertical` en todo — nunca `none` salvo excepciones puntuales |
| **Contenido máximo** | ~1200-1280px (controlado con padding lateral) |
| **Fill de página** | `#FFFFFF` |

### Mobile (390px)

| Propiedad | Valor |
|---|---|
| **Ancho de página** | `390px` |
| **Padding lateral** | `24px` |
| **Cards** | Stack vertical, full width |
| **Carousels** | Scroll horizontal (overflow con clip) |
| **Headlines** | Reducir escala tipográfica (ver sección Tipografía) |

### Responsive: Desktop → Mobile

Cuando hagas la versión mobile de una página desktop:

1. **Reducí el padding** de 80-120px a 24px lateral
2. **Stackeá todo vertical** — nada lado a lado en mobile
3. **Cards a full width** — de 360px fijo a `fill_container`
4. **Hero image** — de 1200px a `fill_container`, ajustá altura
5. **Tipografía** — bajá 1-2 niveles (72→48, 44→26, 20→16)
6. **Carousels** — horizontal scroll con `clip: true` en el padre
7. **Footer** — simplificá a una columna
8. **Botones** — full width en mobile, `fill_container`

---

## Tipografía

### Familias

| Uso | Familia | Notas |
|---|---|---|
| **Headlines/Display** | `Noe Display` | Serif con carácter. Solo para títulos. |
| **Todo lo demás** | `Inter` | Body, nav, botones, labels, legal. |

### Escala Tipográfica — Desktop

| Nivel | Font | Size | Weight | Extra |
|---|---|---|---|---|
| **Hero headline** | Noe Display | `72` | `800` | `letterSpacing: -1`, `lineHeight: 1.05` |
| **Section headline** | Noe Display | `44` | `700` | `letterSpacing: -1`, `lineHeight: 1.1` |
| **Card headline** | Inter | `24` | `700` | `lineHeight: 1.15` |
| **Subtitle/body large** | Inter | `19-20` | `normal` | `lineHeight: 1.5` |
| **Body** | Inter | `17` | `normal` | `lineHeight: 1.5` |
| **Nav/buttons** | Inter | `15-16` | `500-700` | — |
| **Badge** | Inter | `14` | `600` | — |
| **Footer headings** | Inter | `13` | `600` | `letterSpacing: 0.5` |
| **Footer links** | Inter | `13` | `normal` | — |
| **Small/caption** | Inter | `12` | `normal` | — |
| **Legal** | Inter | `10` | `normal` | — |

### Escala Tipográfica — Mobile

| Nivel | Size |
|---|---|
| **Hero headline** | `48` |
| **Section headline** | `26-28` |
| **Card headline** | `20` |
| **Subtitle** | `16` |
| **Body** | `15` |
| **Nav** | `14` |

### Reglas de texto

- **Siempre poné `fill`** en los textos. Sin fill, el texto es invisible.
- **Textos largos:** `textGrowth: "fixed-width"`, `width: "fill_container"` o un ancho fijo.
- **Labels cortos (botones, tags):** Sin `textGrowth` — dejar en `auto`.
- **Nunca adivinar height** en textos — dejar que flexbox lo calcule.
- **textAlign: "center"** para headlines y subtitles centrados. Requiere `textGrowth: "fixed-width"`.

---

## Paleta de Colores

### Colores de texto

| Token | Hex | Uso |
|---|---|---|
| `text-primary` | `#1A1A2E` | Headlines, nav, botones. **NO es negro** — es navy oscuro. |
| `text-secondary` | `#6B7280` | Subtítulos, body, descripciones |
| `text-muted` | `#9CA3AF` | Footer links, placeholders, meta |
| `text-light` | `#C4C4C4` | Copyright, texto muy secundario |
| `text-white` | `#FFFFFF` | Texto sobre imágenes o fondos oscuros |
| `text-brown` | `#6B4C3B` | Acento cálido puntual |

### Colores de fondo

| Token | Hex | Uso |
|---|---|---|
| `bg-white` | `#FFFFFF` | Fondo principal de página |
| `bg-warm-1` | `#FBF9F6` / `#FBF9F7` | Footer, secciones alternas, cards |
| `bg-warm-2` | `#F3F1EE` | Segmented controls, badges, inputs |
| `bg-warm-3` | `#F0EDE8` | Hover states, fondos más marcados |
| `bg-warm-4` | `#F9F7F4` | Cards alternativas |

### Colores de acento

| Token | Hex | Uso |
|---|---|---|
| `accent-yellow` | `#FFE016` | Primary CTA, highlights, badges de equipo |
| `accent-yellow-alt` | `#FDE82B` | Variante de yellow para CTAs secundarios |

### Colores de estructura

| Token | Hex | Uso |
|---|---|---|
| `divider` | `#E8E4DF` | Líneas divisorias |
| `border-faq` | `#E4E4E7` | Bordes de FAQ items |
| `border-light` | `#1a1a2e1a` | Bordes sutiles (header CTA) |

### ⚠️ Reglas de color

- **NUNCA usar `#000000`** (negro puro). Siempre `#1A1A2E`.
- **NUNCA usar grises fríos.** Los grises de Woranz son cálidos (tienen un toque de beige/arena).
- **Alternar fondos** entre secciones: blanco → warm → blanco → warm. Crea ritmo visual.
- **Las sombras** siempre son negras con baja opacidad, no grises.

---

## Spacing System

### Espaciado entre secciones

| Nivel | Valor | Uso |
|---|---|---|
| **XL** | `120px` | Entre secciones principales (Hero↔Content, Content↔FAQ) |
| **L** | `80px` | Padding superior de secciones, gap en carousels |
| **M** | `64px` | Gap interno de secciones con sub-bloques |
| **S** | `48px` | Entre sub-componentes dentro de una sección |
| **XS** | `32px` | Entre elementos relacionados (headline↔quoter, dentro de cards) |
| **XXS** | `24px` | Gap en cards, rows, elementos cercanos |
| **Micro** | `16px` / `20px` | Entre texto y texto, label y input |
| **Tiny** | `10px` / `12px` | Dentro de componentes chicos, footer links |

### Padding de secciones — Desktop

| Sección | Padding |
|---|---|
| **Header** | `[20, 80]` o `[20, 120]` |
| **Hero** | `[80, 80, 0, 80]` |
| **Content section** | `[120, 120, 32, 120]` o `[120, 80, 32, 80]` |
| **Carousel section** | `[80, 0, 0, 120]` (sin padding derecho para scroll) |
| **FAQ / CTA** | `[120, 120, 120, 120]` |
| **Footer** | `[40, 80]` o `[48, 80]` |

### Padding de secciones — Mobile

| Sección | Padding |
|---|---|
| **Header** | `[16, 20]` |
| **Hero** | `[40, 24, 0, 24]` |
| **Content** | `[48, 24]` o `[64, 24]` |
| **Footer** | `[40, 24]` |

---

## Corner Radius

| Elemento | Radius |
|---|---|
| **Cards de producto** | `16` |
| **Cards de imagen** | `12` |
| **CTA Card** | `16` |
| **Quoter Card** | `16` |
| **Botones** | `8` |
| **Pills / Badges** | `100` (full round) |
| **Avatars** | `100` (circular) |
| **Hero image** | `16` |
| **Inputs / Selects** | `10` o `12` |
| **Carousel arrows** | `100` |
| **Tags pequeños** | `6` |

---

## Sombras

| Uso | Configuración |
|---|---|
| **Cards** | `{type:"shadow", shadowType:"outer", blur:24, color:"#00000008", offset:{x:0,y:8}}` |
| **CTA Card** | `{type:"shadow", shadowType:"outer", blur:40, color:"#0000000a", offset:{x:0,y:12}}` |
| **Quoter** | `{type:"shadow", shadowType:"outer", blur:32, color:"#0000001A", offset:{x:0,y:8}}` |
| **Botones** | `{type:"shadow", shadowType:"outer", blur:4, color:"#00000012", offset:{x:0,y:2}}` |

Las sombras son sutiles y cálidas. Nunca usar sombras agresivas o muy oscuras.

---

## Componentes del Sistema

### Header

```javascript
header=I(page,{type:"frame",name:"header",layout:"horizontal",width:"fill_container",padding:[20,80],justifyContent:"space_between",alignItems:"center",fill:"#FFFFFF"})
// Logo a la izquierda (grupo con path del logo Woranz)
// Nav links: Inter 15, weight 500, fill #1A1A2E, gap 36
// CTA button: cornerRadius 8, stroke 1px #1a1a2e1a, padding [12,28]
```

**Estructura:** Logo | [gap] | Nav links + CTA

**Nav items estándar:** Seguros, Coberturas, Nosotros, Contacto

### Hero — Página de Producto

```javascript
hero=I(page,{type:"frame",name:"Hero",layout:"vertical",width:"fill_container",padding:[80,80,0,80],gap:120,alignItems:"center",fill:"#FFFFFF"})
// Badge: pill con cornerRadius 100, fill #fbf9f7, padding [8,20]
// Headline: Noe Display 72, weight 800, centered
// Subtitle: Inter 19, centered, fill #6B7280
// CTAs: Primary (yellow) + Secondary (stroke)
// Hero Image: frame 1200x400, cornerRadius 16, image fill
```

**Regla:** El hero de producto siempre tiene Badge → Headline → Subtitle → CTAs → Imagen.

### Hero — Home

```javascript
hero=I(page,{type:"frame",name:"Hero",layout:"vertical",width:"fill_container",padding:[80,80,0,80],gap:48,alignItems:"center",fill:"#fbf9f7"})
// Segmented Control: pills con cornerRadius 100, fill #F3F1EE
// Headline: Noe Display 72, centered
// Subtitle + CTAs
// Imagen grande o grid de imágenes
```

**Diferencia con producto:** Tiene segmented control (Personas/Empresas) y fondo warm.

### Badge (Pill)

```javascript
badge=I(parent,{type:"frame",name:"Badge",cornerRadius:100,fill:"#fbf9f7",padding:[8,20],justifyContent:"center",alignItems:"center"})
I(badge,{type:"text",content:"Texto del badge",fontFamily:"Inter",fontSize:14,fontWeight:"600",fill:"#1A1A2E"})
```

### Primary CTA Button

```javascript
btn=I(parent,{type:"frame",name:"Primary CTA",cornerRadius:8,fill:"#FFE016",padding:[18,44],justifyContent:"center",alignItems:"center",effect:{type:"shadow",shadowType:"outer",blur:4,color:"#00000012",offset:{x:0,y:2}}})
I(btn,{type:"text",content:"Cotizá ahora",fontFamily:"Inter",fontSize:16,fontWeight:"700",fill:"#1A1A2E"})
```

### Secondary CTA Button

```javascript
btn=I(parent,{type:"frame",name:"Secondary CTA",cornerRadius:8,fill:"#00000000",padding:[18,44],justifyContent:"center",alignItems:"center",stroke:{thickness:1.5}})
I(btn,{type:"text",content:"Conocé más",fontFamily:"Inter",fontSize:16,fontWeight:"500",fill:"#1A1A2E"})
```

### Section Header (con o sin carousel arrows)

```javascript
// Sin arrows
header=I(section,{type:"frame",name:"headerGroup",layout:"vertical",gap:2,width:800,alignItems:"center"})
I(header,{type:"text",content:"Título de sección",fontFamily:"Noe Display",fontSize:44,fontWeight:"700",fill:"#1A1A2E",letterSpacing:-1,textAlign:"center"})
I(header,{type:"text",content:"Subtítulo descriptivo",fontFamily:"Inter",fontSize:20,fontWeight:"normal",fill:"#6B7280",textAlign:"center"})

// Con arrows (carousel)
header=I(section,{type:"frame",name:"newHeader",layout:"horizontal",width:"fill_container",justifyContent:"space_between",alignItems:"center",padding:[0,80,0,0]})
// Título a la izquierda + arrows a la derecha (56x56, cornerRadius 100)
```

### Product Card (Vertical)

```javascript
card=I(parent,{type:"frame",name:"Card",layout:"vertical",width:360,height:460,cornerRadius:16,padding:40,gap:24,justifyContent:"space_between",fill:["#fbf9f7","#ffffff00"],effect:{type:"shadow",shadowType:"outer",blur:24,color:"#00000008",offset:{x:0,y:8}}})
// Top: icon/emoji + título + descripción + lista de features
// Bottom: CTA link "Hablá con nosotros →" o botón
```

### Image Card (con texto superpuesto)

```javascript
card=I(parent,{type:"frame",name:"Card",layout:"vertical",width:360,height:521,cornerRadius:12,clip:true,justifyContent:"end",padding:[24,20],gap:5,fill:[
  {type:"image",mode:"fill",url:"./images/foto.png"},
  {type:"gradient",gradientType:"linear",rotation:0,size:{height:1},colors:[{color:"#00000066",position:0},{color:"#ffffff00",position:0.4}]}
]})
I(card,{type:"text",content:"Texto sobre la imagen",fontFamily:"Inter",fontSize:24,fontWeight:"700",fill:"#FFFFFF",lineHeight:1.15,textGrowth:"fixed-width",width:"fill_container"})
```

**Nota:** El gradiente oscuro va de abajo hacia arriba para que el texto blanco sea legible.

### CTA Card (Full width)

```javascript
cta=I(parent,{type:"frame",name:"CTA Card",layout:"vertical",width:"fill_container",cornerRadius:16,padding:64,gap:32,alignItems:"center",fill:"#FFFFFF",effect:{type:"shadow",shadowType:"outer",blur:40,color:"#0000000a",offset:{x:0,y:12}}})
// Headline centrado (Noe Display 44)
// Subtitle centrado (Inter 17)
// Team avatars (52x52, gap -12, cornerRadius 100)
// Botones (Primary + Secondary)
```

### FAQ Section

```javascript
faqSection=I(parent,{type:"frame",name:"FAQs",layout:"vertical",width:"fill_container",padding:120,gap:120,fill:"#FFFFFF",stroke:{align:"inside",thickness:{top:1}}})

// FAQ Header: Noe Display 44, "¿Dudas?"
// FAQ List: frame vertical, width ~715
// FAQ Item: height 90, padding [24,0], stroke bottom #E4E4E7
//   - Pregunta: Inter 17, weight 500
//   - Icono: chevron-down, 20x20
//   - Respuesta (item abierto): Inter 15, fill #6B7280
```

### Footer

```javascript
footer=I(page,{type:"frame",name:"footer",layout:"vertical",width:"fill_container",padding:[48,80],gap:40,fill:"#FBF9F6"})
// Footer Top: Logo izq + 4 columnas de links (Productos, Empresa, Soporte, Legal)
// Divider: fill #E8E4DF, height 1
// Logos aseguradoras: rectangle con image fill
// Legal text: Inter 10, fill #9CA3AF
// Divider
// Bottom: Copyright (Inter 12, #C4C4C4) + Social icons (lucide, 16x16, #9CA3AF)
```

### Divider

```javascript
I(parent,{type:"frame",name:"Divider",width:"fill_container",height:1,fill:"#E8E4DF"})
```

### Team Avatars Row

```javascript
avatars=I(parent,{type:"frame",name:"Team Avatars",layout:"horizontal",gap:-12,alignItems:"center"})
// 4-5 avatars: 52x52, cornerRadius 100, image fill, stroke outside #FBF9F6 3px
// Counter pill: 52x52, cornerRadius 100, fill #FFE016, "+9" text
// Label: "personas cuidando de vos", Inter 15, weight 500, #6B7280
```

### Carousel Arrows

```javascript
arrowLeft=I(parent,{type:"frame",name:"arrowLeft",width:56,height:56,cornerRadius:100,justifyContent:"center",alignItems:"center",stroke:{align:"inside",thickness:2}})
I(arrowLeft,{type:"icon_font",iconFontFamily:"phosphor",iconFontName:"caret-left",width:28,height:28,fill:"#1A1A2E"})

arrowRight=I(parent,{type:"frame",name:"arrowRight",width:56,height:56,cornerRadius:100,justifyContent:"center",alignItems:"center",fill:"#FFFFFF"})
I(arrowRight,{type:"icon_font",iconFontFamily:"phosphor",iconFontName:"caret-right",width:28,height:28,fill:"#1A1A2E"})
```

---

## Estructura de Página — Templates

### Template: Página de Producto (Desktop)

Orden de secciones y sus propiedades:

```
1. Header          → padding [20,80-120], fill #FFFFFF
2. Hero            → padding [80,80,0,80], gap 120, fill #FFFFFF
   - Badge + Headline + Subtitle + CTAs
   - Hero Image (1200x400, cornerRadius 16)
3. Quoter          → padding [120,120,32,120], gap 64
   - Section header (Noe 44) + subtitle
   - Quoter Card (shadow, selectors row)
4. Coberturas      → padding [80,0,0,120], gap 40, clip true
   - Carousel header + arrows
   - Cards row (360px each, gap 24)
5. FAQ + CTA       → padding 120, gap 120, stroke top 1px
   - FAQ header + list
   - CTA Card (centrado, avatars, botones)
   - Image cards carousel (opcional)
6. Footer          → padding [48,80], gap 40, fill #FBF9F6
```

### Template: Home (Desktop)

```
1. Header          → padding [20,80]
2. Hero            → padding [80,80,0,80], fill #fbf9f7
   - Segmented Control (Personas/Empresas)
   - Headline + Subtitle + CTAs
   - Imagen o grid
3. Momentos        → padding [120,0,0,0], fill #FBF9F6
   - Section header + "Ver todos →"
   - Product cards grid/carousel
4. Cómo Funciona   → padding [64,120,0,120]
   - 3 pasos en row (01, 02, 03)
5. CTA + FAQ       → padding 120, stroke top
6. Footer          → padding [48,80], fill #FBF9F6
```

### Template: Página de Producto (Mobile — 390px)

```
1. Header          → padding [16,20], height 56
2. Hero            → padding [40,24,0,24], gap 32
   - Badge + Headline (48px) + Subtitle (16px)
   - CTAs stacked vertical, full width
   - Hero Image (fill_container, height ~220)
3. Content         → padding [48,24], gap 32
   - Cards stack vertical, fill_container
4. FAQ             → padding [64,24]
5. CTA Card        → padding 24-32
6. Footer          → padding [40,24]
```

---

## Principios de Diseño & UX

### Gestalt — Aplicación en Woranz

1. **Proximidad:** Elementos relacionados van juntos. Headline + subtitle = gap 2-20px. Secciones diferentes = gap 120px. Si dos cosas están cerca, el usuario asume que se relacionan.

2. **Similitud:** Todas las cards de un carousel tienen la misma estructura, tamaño y estilo. No mezclar cards de 360px con cards de 400px en la misma fila.

3. **Continuidad:** El ojo sigue líneas. Las secciones fluyen verticalmente sin interrupciones bruscas. Los dividers (#E8E4DF) crean separación suave, no cortes.

4. **Cierre:** Las cards con cornerRadius y sombra se perciben como unidades completas. El CTA Card con sus bordes redondeados y sombra se lee como una "caja" de acción.

5. **Figura-fondo:** El fondo alterno (blanco ↔ #FBF9F6) crea capas visuales. Las cards "flotan" sobre el fondo gracias a las sombras sutiles.

### Nielsen — Heurísticas aplicadas

1. **Visibilidad del estado:** El segmented control muestra en qué tab estás (Personas/Empresas). El quoter muestra las selecciones actuales.

2. **Correspondencia con el mundo real:** Lenguaje de seguros simplificado. "Cotizá" en vez de "Solicitar cotización". "¿Dudas?" en vez de "Preguntas frecuentes".

3. **Control del usuario:** CTAs claros con acciones reversibles. Siempre un camino de vuelta (nav, logo = home).

4. **Consistencia:** Todas las páginas usan el mismo header, footer, tipografía, colores. Un botón amarillo siempre es la acción principal.

5. **Prevención de errores:** El quoter usa selects predefinidos, no inputs libres. Menos chance de error.

6. **Reconocimiento sobre recuerdo:** Iconos + labels en las cards. Nunca solo iconos.

7. **Flexibilidad y eficiencia:** Primary CTA (acción directa) + Secondary CTA (explorar más). Dos velocidades de usuario.

8. **Diseño estético y minimalista:** Mucho aire, pocos elementos por sección. Cada elemento tiene un propósito.

### Reglas de Composición

1. **Un focal point por sección.** Nunca competir entre headline, imagen y CTA. Jerarquía clara: headline primero, después todo lo demás.

2. **Ritmo visual:** Alternar secciones densas (cards, contenido) con secciones amplias (CTA, hero). Nunca dos secciones pesadas seguidas.

3. **Breathing room:** Las secciones tienen padding generoso (80-120px). No apretar contenido. El espacio en blanco es parte del diseño.

4. **Alignment:** Todo se alinea a una grilla implícita. El contenido principal tiene ~1200px de ancho. Las excepciones (carousels que sangran) son intencionales.

5. **Contraste tipográfico:** Noe Display (serif) para headlines crea contraste con Inter (sans) para body. Nunca usar Inter para headlines principales ni Noe para body.

---

## Workflow en Pencil

### Paso 1 — Entendé el contexto

1. Leé `../woranz-productos/PRODUCTOS.md` si es una página de producto.
2. `get_editor_state` para ver el estado actual y componentes disponibles.
3. `batch_get` de una página existente similar para usar como referencia.
4. `get_screenshot` de la referencia para tener el visual en mente.

### Paso 2 — Planificá la estructura

Antes de tocar nada, definí:
- ¿Qué template usar? (Producto, Home, Empresas)
- ¿Qué secciones necesita esta página?
- ¿Hay algo custom o todo sigue el template?
- ¿Desktop, mobile o ambos?

### Paso 3 — Construí por secciones

1. **Creá el frame principal** con `placeholder: true`:
```javascript
page=I(document,{type:"frame",name:"[Nombre Página]",layout:"vertical",width:1440,height:"fit_content(2000)",fill:"#FFFFFF",placeholder:true})
```

2. **Copiá secciones existentes** cuando sea posible:
```javascript
// Copiar header de AP
header=C("pZQbY",page)
// Copiar footer de AP
footer=C("sirz7",page)
```

3. **Construí secciones nuevas** siguiendo los templates de componentes.

4. **Máximo 25 operaciones por `batch_design`**. Dividí por sección lógica.

### Paso 4 — Verificá visualmente

1. `get_screenshot` de cada sección nueva.
2. `snapshot_layout` para verificar posiciones y clipping.
3. Checklist:
   - [ ] Tipografía correcta (Noe para headlines, Inter para todo lo demás)
   - [ ] Colores del sistema (nunca #000000)
   - [ ] Spacing consistente con el sistema
   - [ ] Corner radius correctos
   - [ ] Sombras en cards/CTAs
   - [ ] Textos tienen `fill` (no invisibles)
   - [ ] Layout vertical, no absolute positioning
   - [ ] Jerarquía visual clara
   - [ ] Fondo alterno entre secciones

### Paso 5 — Remové placeholder

```javascript
U("pageId",{placeholder:false})
```

**NUNCA dejes `placeholder: true` en un frame terminado.**

---

## Buenas Prácticas

1. **Copiá, no recrees.** Si una sección ya existe en v4.pen, usá `C()` y modificá. Es más rápido y más consistente.

2. **Nombrá todo.** Cada frame debe tener un `name` descriptivo: "Hero", "FAQ Section", "Card 1", no "Frame 47".

3. **`fill_container` > valores fijos.** Si el elemento debe ocupar el ancho del padre, usá `fill_container`, no `1200`.

4. **`fit_content` para alturas.** Las secciones crecen con su contenido, no tienen altura fija.

5. **No uses `layout: "none"`** salvo que necesites posicionamiento absoluto (muy raro).

6. **Icons:** Siempre de `phosphor` o `lucide`. Tamaño estándar: 20-28px. Fill: `#1A1A2E` o `#9CA3AF`.

7. **Imágenes:** Son fills en frames, no nodos separados. Usá `G()` para generar o buscar stock.

8. **Variables:** Usá las variables del documento (`$text-primary`, `$bg-white`, etc.) cuando existan. Consultá con `batch_get` del documento.

---

## Reglas de Oro

1. **Consistencia > Creatividad.** Seguir el sistema es más importante que inventar algo nuevo. Si la página de AP tiene esa estructura, la de Hogar también.

2. **El espacio es diseño.** No llenes todo. Las secciones respiran con 120px de separación.

3. **Mobile no es "desktop chiquito".** Repensar la jerarquía, simplificar, stackear. No solo achicar.

4. **Noe Display solo para headlines.** Nunca para body, labels o botones.

5. **Amarillo (#FFE016) solo para acciones primarias.** No para decoración.

6. **Navy (#1A1A2E) en vez de negro.** Siempre.

7. **Verificar con screenshot.** Siempre. Después de cada batch_design significativo.
