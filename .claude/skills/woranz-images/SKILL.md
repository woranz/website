---
name: woranz-images
description: "Generador de imágenes consistentes para Woranz en Pencil. Usá este skill cuando necesites crear, reemplazar o generar imágenes para el sitio web de Woranz dentro de Pencil. Se activa cuando el usuario menciona 'imagen', 'foto', 'ilustración', 'hero image', 'visual', 'stock', 'generar imagen', 'cambiar imagen', o cualquier pedido relacionado con assets visuales del sitio en Pencil. También se activa si dice 'necesito una foto para esta sección' o 'ponele una imagen acá'."
---

# Woranz Image Engine — Pencil Workflow

Generás todas las imágenes del sitio de Woranz manteniendo una línea visual coherente, moderna y cálida. Cada imagen debe sentirse parte del mismo universo: una insurtech humana, tecnológica pero cercana.

## ⚠️ PASO 0 — Obligatorio antes de cualquier acción

**SIEMPRE leé `../woranz-productos/PRODUCTOS.md` antes de generar o elegir una sola imagen.** Ahí está la definición visual de cada producto: qué sentimiento transmitir, qué tipo de imagen usar, qué público tiene. No generes una imagen sin haber leído la ficha del producto primero.

---

## Identidad Visual Woranz

### El Universo Visual

Woranz no es una aseguradora tradicional con fotos de stock genéricas de gente sonriendo en oficinas. Tampoco es una fintech fría con gradientes neón. Woranz vive en el punto medio: **tecnología con calidez humana**.

**Referencia principal: [Getsafe](https://www.hellogetsafe.com/en-de).** Esa es la vara. Imágenes limpias, mucho aire, colores cálidos, fondos neutros (blancos, cremas, grises claros). Personas reales en momentos auténticos de vida cotidiana — no modelos posando sino gente que vive su vida tranquila porque sabe que está cubierta. La composición siempre deja respirar al texto.

### Regla Fundamental: Personas vs. Producto

Esta es la regla más importante para decidir qué imagen va en cada lugar:

| Contexto | Qué mostrar | Por qué |
|---|---|---|
| **Secciones de vida/cobertura** | **Siempre personas** | Woranz protege personas, no objetos. El usuario se tiene que ver reflejado. |
| **Secciones de features/producto** | **Mockup de dispositivo con la app** | Cuando hablamos de cómo funciona la tecnología, mostramos la interfaz. Puede ser celular, tablet o notebook — lo importante es que la pantalla siempre sea visible para el espectador. |

**En resumen:** Si la sección habla de "qué te cubre" → personas viviendo su vida. Si la sección habla de "cómo funciona" → celular con la app.

Se pueden combinar: una persona interactuando con el celular funciona bien (como hace Getsafe). Lo que no queremos es que quede ambiguo — el foco tiene que estar claro: o la persona es protagonista, o el device es protagonista.

### Prompts Base (Prefijos Obligatorios)

Hay dos prefijos según el tipo de contenido. Usá el que corresponda:

**Para secciones con personas (lifestyle):**
```
modern insurtech lifestyle, bright studio lighting, clean minimal composition, warm tones, natural authentic feel, professional photography, simple clean background, shallow depth of field, latin mediterranean appearance, light to olive skin,
```

**Para secciones de features/producto (device mockup):**
```
minimal product photography, device screen facing viewer, front view of screen visible to camera, soft shadow, clean background, warm neutral tones,
```

Las pantallas pueden mostrarse con UI (una interfaz genérica tipo app de seguros) o en blanco — elegí lo que mejor funcione para la composición. Si generás UI en pantalla, que sea limpia y minimalista, coherente con la estética Woranz.

Estos prefijos son innegociables. Van antes de cualquier descripción específica de la imagen. Nunca generes una imagen sin el prefijo que corresponda.

### Paleta Visual

- **Tonos dominantes:** Cálidos — arena, durazno suave, terracota claro, blanco cálido
- **Acentos:** Coral suave, verde menta apagado, azul cielo desaturado
- **Evitar:** Negro puro, colores neón, saturación alta, tonos fríos dominantes
- **Iluminación:** Brillante y clara, estilo estudio. Las imágenes tienen que ser luminosas, no oscuras ni dramáticas. Pensá en fotos de catálogo de moda: mucha luz, sin sombras duras, todo bien iluminado

### Personas: Aspecto y Demografía

Las personas en las imágenes deben verse como argentinos/as típicos: **aspecto latinoamericano/mediterráneo**. Piel clara a trigueña, rasgos europeos-latinos mezclados. Pensá en la gente que ves caminando por Palermo o Córdoba capital.

- **SÍ:** Rasgos latinos/mediterráneos, piel clara a trigueña, aspecto joven-adulto (25-40). Puede haber rubios, castaños, morochos — Argentina tiene mezcla
- **NO:** Rasgos asiáticos o africanos que no son representativos del mercado argentino
- Sin nada ultra-regional ni estereotipado. Gente moderna, urbana, que podría vivir en cualquier ciudad argentina grande

En los prompts AI, agregá siempre: `latin mediterranean appearance, light to olive skin` — pero **variá las descripciones físicas** para que no todas las personas se vean iguales. Rotá entre estas variaciones:

- **Pelo:** `dark curly hair` / `short brown hair` / `wavy auburn hair` / `blonde straight hair` / `dark wavy hair pulled back` / `light brown messy hair`
- **Edad aparente:** `early 20s` / `late 20s` / `mid 30s` / `early 40s`
- **Género:** Alterná entre hombres y mujeres. Incluí parejas o grupos mixtos cuando corresponda.
- **Build/estilo:** `athletic build` / `slim` / `average build` / `wearing glasses` / `with beard` / `freckles`
- **Ropa:** `casual streetwear` / `smart casual` / `activewear` / `cozy sweater` / `linen shirt` / `denim jacket`

**Regla: nunca repitas la misma combinación de pelo + edad + género en una misma página.** Si ya generaste una mujer morocha de 30, la siguiente es un rubio de 25 o una castaña de 35 con anteojos. Argentina tiene mezcla — reflejalo.

### Sentimiento antes que escena — Basado en el producto

La imagen no es decorativa — tiene que transmitir el sentimiento correcto para el **producto específico** de esa página o sección.

**⚠️ NO uses sentimientos genéricos.** Cada producto tiene su propio mundo visual definido en `../woranz-productos/PRODUCTOS.md`. Antes de generar cualquier imagen:

1. **Identificá qué producto es** (por el texto de la sección, el título de la página, o preguntale al usuario)
2. **Leé la ficha del producto** en PRODUCTOS.md — ahí dice: sentimiento visual, público, dolor que resuelve
3. **Generá la imagen basándote en eso**, no en una tabla genérica

**Ejemplos de cómo cambia la imagen según el producto:**

| Producto | Lo que dice PRODUCTOS.md | Qué generar |
|---|---|---|
| **Caución Alquiler** | Libertad, independencia, arrancar algo nuevo | Persona joven con llaves, cajas de mudanza, departamento nuevo, sonrisa de logro |
| **Accidentes Personales** | Confianza, seguridad, vida activa sin miedo | Persona activa, corriendo/andando en bici/haciendo yoga, expresión segura |
| **Caución Turismo Estudiantil** | Protección paternal, tranquilidad familiar | Padre/madre tranquilos, NO adolescentes de fiesta |
| **Hogar** | Calidez del hogar, seguridad doméstica | Persona relajada en su casa, sofá, mate, ambiente cálido hogareño |
| **Integral de Comercio** | Emprendimiento, negocio propio | Comerciante orgulloso en su local, vidriera, mostrador |
| **Aeronavegación** | Aviación, tecnología, profesionalismo | Drone, cielo, helicóptero — puede romper la paleta cálida |
| **RC Profesional** | Protección empresarial, profesionalismo | Más abstracto, sin personas necesariamente. Solidez. |

**Si la imagen no tiene relación obvia con el producto, está mal.** Una persona genérica sonriendo no sirve para Caución Alquiler — necesitás llaves, departamento, mudanza. Una persona genérica no sirve para Integral de Comercio — necesitás un comerciante en su local.

Para secciones transversales (testimonios, contacto, pricing) que no son de un producto específico:

| Contexto | Sentimiento | Ejemplo visual |
|---|---|---|
| Testimonios | **Amistad, cercanía** | Grupo de amigos en momento genuino, complicidad |
| Contacto / Ayuda | **Calidez, disponibilidad** | Persona accesible, gesto amable, ambiente cálido |
| Pricing / Planes | **Claridad, simplicidad** | Composición limpia y despejada |

### Fondos: Simples, el foco es la persona

**Regla clave: el fondo no compite con la persona.** Getsafe usa fondos limpios, desenfocados o de color sólido/gradiente suave. El protagonista siempre es la persona, nunca el lugar.

- **Fondos ideales:** Color sólido cálido, gradiente suave, desenfoque fuerte (bokeh), estudio con luz natural, pared lisa
- **Fondos aceptables:** Exterior muy desenfocado donde apenas se distingue el lugar
- **Fondos NO:** Paisajes detallados, calles con mucho contexto, interiores recargados, fondos que cuentan una historia propia

En los prompts, siempre incluí: `simple clean background, shallow depth of field, soft bokeh` o `solid warm color background, studio lighting`.

### Variedad: Cada imagen es un mundo diferente

Si generás múltiples imágenes para una misma página o sección, **cada una tiene que sentirse diferente**. Si todas tienen el mismo fondo, la misma luz y la misma pose, parece un catálogo de stock barato.

Variá entre:
- **Tipo de fondo:** Una con fondo sólido, otra con bokeh exterior, otra con estudio
- **Encuadre:** Una de cuerpo entero, otra de medio cuerpo, otra primer plano
- **Actividad:** Cada persona haciendo algo distinto, no todos "caminando" o todos "sonriendo a cámara"
- **Luz:** Una con luz dorada, otra con luz neutra suave, otra con luz de mañana
- **Paleta del fondo:** Una con fondo arena, otra con fondo blanco, otra con tono rosado suave

La coherencia viene del estilo (prefijo obligatorio) y la paleta cálida, no de que todas las fotos se vean iguales.

### Fotos del equipo real

En `/Users/marcos/Sites/woranz-design/equipo/` hay fotos reales del equipo de Woranz. **Usalas siempre que el contexto sea "te acompañamos", "somos personas", "nuestro equipo", "estamos acá para vos"** o cualquier sección que humanice la marca mostrando a la gente detrás de Woranz.

**Principales (priorizar estos):**
- Charlie.JPG
- Martina.JPG
- Melu.jpg
- Sebas.JPG
- Vanesa.JPG
- Gianella.JPG
- Gonzalo.JPG
- Marianela.JPG

**Resto del equipo:** Ariel, Carolina, Debo, Eliana, Emiliano, Ezequiel, Herman, Josefina, Marcelo, Maria del mar, Mariela, Mario, Meli, Micaela, Priscilla, Valentina, Yasmin.

**Cómo usarlas — paso a paso en Pencil:**

Las fotos son materia prima. NUNCA se insertan tal cual ni se genera algo distinto. El proceso es:

1. **Creá un frame** del tamaño que necesitás en el diseño
2. **Aplicá un fondo** al frame: color sólido cálido, gradiente suave, o lo que pida la composición (usando `fill` o `G()` para un fondo generado)
3. **Insertá la foto de la persona** como una imagen dentro de ese frame, posicionada y escalada para que funcione en la composición
4. Si la foto tiene un fondo feo, usá un recorte circular o con bordes suaves para integrarla mejor
5. **Ajustá** para que el resultado final se vea como una pieza diseñada, no como una foto pegada

Ejemplo en `batch_design`:
```javascript
card=I("sectionId",{type:"frame",name:"Team Member",width:300,height:360,fill:"#F5EDE3",cornerRadius:16})
photo=I(card,{type:"frame",name:"Photo",width:200,height:200,cornerRadius:100,x:50,y:40})
// Insertar la foto real de la persona en el frame circular
name=I(card,{type:"text",content:"Martina",y:260,fontSize:18,fontWeight:"bold"})
role=I(card,{type:"text",content:"Tu asesora",y:285,fontSize:14})
```

Para secciones de equipo, usá 3-4 fotos principales variadas. Para cards de "tu asesor" o "chateá con nosotros", usá una foto individual.

**El tono visual de "te acompañamos":**

"Te acompañamos" en Woranz es profesional y cercano, NO romántico ni emotivo. Pensá en un equipo que te respalda, no en un abrazo grupal. El vibe es:

- **SÍ:** Personas del equipo con expresión amable y profesional, como una foto de perfil de LinkedIn buena. Confianza, competencia, cercanía.
- **SÍ:** Composiciones tipo grid de equipo, cards individuales con nombre y rol, foto + quote.
- **NO:** Personas abrazándose, tomadas de la mano, o en situaciones que parezcan publicidad de seguros de vida emotiva.
- **NO:** Fotos grupales tipo "familia feliz". Cada persona individual, compuesta por separado.

El mensaje visual es: "somos gente real, profesional, que sabe lo que hace y está acá para ayudarte". No "te queremos mucho".

**Cuándo NO generar con AI:** Si la sección habla del equipo de Woranz, NUNCA uses personas generadas. Usá las fotos reales. Las personas inventadas en una sección de "conocé al equipo" destruyen la credibilidad.

### Lo que SÍ queremos

- Personas como protagonistas claras, fondos que no distraen
- Fondos simples: sólidos, gradientes suaves, bokeh
- Variedad visual entre imágenes de una misma página
- Composiciones limpias con un punto focal claro
- Momentos de calma y seguridad (no de crisis o accidentes)

### Lo que NO queremos

- Fondos detallados que compiten con la persona
- Todas las imágenes con el mismo fondo/luz/pose
- Stock genérico corporativo (gente con trajes señalando pantallas)
- Imágenes de accidentes, hospitales o situaciones de estrés
- Ilustraciones infantiles o clip art
- Personas posando artificialmente o sonrisas forzadas
- Texto dentro de las imágenes
- Devices con la pantalla de espaldas al espectador — la pantalla siempre tiene que ser visible

---

## Workflow

### Paso 1 — Entendé el contexto (OBLIGATORIO)

1. Usá `pencil.get_editor_state` para ver el estado actual del diseño.
2. Usá `pencil.get_screenshot` para capturar la sección donde va la imagen.
3. Usá `pencil.batch_get` del nodo y sus hermanos para **leer los textos que rodean la imagen** (headlines, subtitles, body, labels de la sección).
4. Identificá:
   - Dónde va la imagen (hero, card, sección, fondo)
   - **Tamaño exacto del frame destino** (ancho x alto en px). Esto define el encuadre — ver Paso 5
   - **Qué dicen los textos de la sección** — la imagen tiene que ilustrar ESE contenido, no algo genérico
   - **Qué producto es** — buscá en los textos pistas del producto (nombre, cobertura, servicio) y leé su ficha en PRODUCTOS.md
   - **Qué sentimiento debería transmitir** basándote en el producto y el texto

**⚠️ La imagen SIEMPRE responde al texto que la acompaña.** Si el headline dice "Alquilá sin garante", la imagen tiene que mostrar algo de mudanza/departamento/llaves. Si dice "Tu negocio, cubierto", tiene que mostrar un comercio. Si dice "Viví tranquilo", tiene que mostrar a alguien en calma.

**Si no podés determinar el contexto** (no hay textos cerca, el nodo está vacío, o la sección es ambigua), **preguntale al usuario**: "¿Qué producto o sección es esta imagen? Necesito saberlo para generar algo relevante."

### Paso 2 — Buscá primero en stock, generá solo si no hay

**Stock primero, AI como fallback.** Las fotos reales de Unsplash siempre se ven más naturales que las generadas. Intentá siempre stock primero.

El flujo es:

1. **Probá con `G(nodeId, "stock", "keywords")`** usando keywords que reflejen el sentimiento + escena que necesitás
2. **Verificá con screenshot** si la foto cumple las condiciones Woranz (paleta cálida, aspecto argentino de las personas, sentimiento correcto, encuadre adecuado al tamaño)
3. **Si no cumple**, probá con otros keywords (2-3 intentos máximo)
4. **Solo si stock no funciona**, pasá a `G(nodeId, "ai", "prompt")` con el prefijo obligatorio

| Tipo | Cuándo usarlo |
|---|---|
| `"stock"` | **Siempre primero.** Personas reales, paisajes, situaciones cotidianas. Unsplash tiene buen material lifestyle |
| `"ai"` | Cuando stock no da resultados que cumplan las condiciones, o necesitás una composición muy específica (ej: mockup de celular con UI particular) |

**Excepción:** Para device mockups (secciones de features/producto), AI directamente — no vas a encontrar mockups de la app de Woranz en stock.

### Paso 3 — Consultá el Style Guide de Pencil

Antes de generar, sincronizá con el sistema de estilos:

1. Usá `pencil.get_style_guide_tags` para ver las tags disponibles.
2. Usá `pencil.get_style_guide` con tags que matcheen la estética Woranz. Tags recomendadas para buscar:
   - `warm`, `minimal`, `clean`, `modern`, `soft`, `lifestyle`, `professional`
3. Usá la info del style guide para refinar los prompts de las imágenes.

### Paso 4 — Construí el prompt

#### Para imágenes AI (`type: "ai"`)

Siempre usá esta estructura:

```
[PREFIJO OBLIGATORIO] + [descripción específica] + [estilo/mood]
```

**Ejemplos — Personas (lifestyle):**

Hero de Accidentes Personales:
```
modern insurtech lifestyle, bright studio lighting, clean minimal composition, warm tones, natural authentic feel, professional photography, simple clean background, shallow depth of field, latin mediterranean appearance, light to olive skin, young person smiling confidently, relaxed pose, solid warm beige background
```

Cobertura Deportiva:
```
modern insurtech lifestyle, bright studio lighting, clean minimal composition, warm tones, natural authentic feel, professional photography, simple clean background, shallow depth of field, latin mediterranean appearance, light to olive skin, person in athletic wear stretching, bright white studio background, energetic but calm
```

Testimonios:
```
modern insurtech lifestyle, bright studio lighting, clean minimal composition, warm tones, natural authentic feel, professional photography, simple clean background, shallow depth of field, latin mediterranean appearance, light to olive skin, two friends laughing together, soft pink gradient background, candid natural moment
```

**Ejemplos — Producto (device mockup):**

Smartphone flotante:
```
minimal product photography, smartphone screen facing viewer, front view of screen visible to camera, soft shadow, clean white background, warm neutral tones, modern smartphone floating at slight angle
```

Persona con celular:
```
minimal product photography, person holding smartphone, screen facing viewer, bright studio lighting, warm tones, latin mediterranean appearance, simple clean background
```

Tablet en escritorio:
```
minimal product photography, tablet on desk, screen facing viewer, soft shadow, warm neutral tones, clean minimal workspace, bright lighting
```

#### Para imágenes stock (`type: "stock"`)

Usá keywords cortos y específicos:

```
lifestyle outdoor warm light cycling
person working remote cozy
friends laughing natural light
morning routine peaceful
```

**Evitá keywords como:** insurance, accident, hospital, business suit, corporate, office meeting

### Paso 5 — Ajustá encuadre y composición al tamaño

Antes de generar, medí el frame destino. El encuadre de la imagen tiene que estar pensado para ese tamaño, no al revés.

| Formato | Encuadre recomendado | Prompt keywords |
|---|---|---|
| **Landscape ancho** (hero, banner: ~1200x400) | Escena amplia, sujeto descentrado, mucho aire a los costados para texto | `wide shot, off-center subject, negative space for text` |
| **Landscape medio** (cards: ~360x240) | Medio cuerpo o plano americano, sujeto centrado | `medium shot, centered subject, clean background` |
| **Cuadrado** (~1:1) | Retrato de hombros arriba o detalle de escena | `portrait crop, shoulders up, tight framing` |
| **Vertical** (mobile hero, sidebar) | Plano medio-cerrado, sujeto en tercio superior | `vertical composition, upper third focus` |
| **Pequeño/Thumbnail** (~120x120) | Primer plano o detalle icónico, muy simple | `close up detail, simple iconic, minimal elements` |

Incluí estos keywords de encuadre al final del prompt para que la imagen generada ya venga con la composición correcta para el espacio disponible. Una imagen panorámica en un espacio cuadrado se ve mal recortada — mejor generarla bien desde el inicio.

### Paso 6 — Generá e insertá la imagen

Las imágenes en Pencil no son nodos propios — son **fills** aplicados a frames o rectángulos.

1. Primero creá el frame contenedor (o usá uno existente):
```javascript
heroImg=I("parentId",{type:"frame",name:"Hero Image",width:1200,height:600,cornerRadius:16})
G(heroImg,"ai","modern insurtech lifestyle, warm soft lighting, clean minimal composition, muted warm tones, natural and authentic feel, professional photography style, young woman walking confidently through sunlit park, feeling of calm and protection")
```

2. Para reemplazar una imagen existente en un frame:
```javascript
G("existingFrameId","ai","modern insurtech lifestyle, warm soft lighting, ...")
```

3. Para múltiples imágenes en una sección (cards por ejemplo):
```javascript
card1Img=I("cardsContainer",{type:"frame",name:"Card Image 1",width:360,height:240,cornerRadius:12})
G(card1Img,"stock","person cycling sunny city warm")
card2Img=I("cardsContainer",{type:"frame",name:"Card Image 2",width:360,height:240,cornerRadius:12})
G(card2Img,"stock","morning yoga park peaceful")
card3Img=I("cardsContainer",{type:"frame",name:"Card Image 3",width:360,height:240,cornerRadius:12})
G(card3Img,"stock","friends hiking nature adventure")
```

### Paso 7 — Verificá el resultado

1. Usá `pencil.get_screenshot` para ver cómo quedó la imagen en contexto.
2. Checklist de validación (tiene que cumplir TODAS):
   - [ ] **Orientación/Perspectiva:** Si hay un dispositivo, la pantalla tiene que ser visible para el espectador. Si se ve el dorso del device o la pantalla apunta para otro lado, regenerar. Esto es un error común de los generadores AI.
   - [ ] **Brillo:** La imagen es luminosa y clara, no oscura ni con sombras dramáticas
   - [ ] **Fondo:** Simple (sólido, gradiente suave, bokeh). No hay fondo detallado que compita con la persona
   - [ ] **Paleta:** Tonos cálidos, sin colores fríos dominantes ni saturación agresiva
   - [ ] **Personas:** Si hay personas, aspecto latino/mediterráneo (no asiático ni africano)
   - [ ] **Sentimiento:** La imagen transmite la emoción correcta para esa sección
   - [ ] **Encuadre:** La composición funciona para el tamaño del frame, sin recortes raros
   - [ ] **Texto:** La imagen no compite con el copy que la rodea
   - [ ] **Calidad:** Sin artefactos, distorsiones o elementos extraños (especialmente en AI)
   - [ ] **Marca:** No se ven logos de otras marcas, textos en otros idiomas, ni elementos fuera de lugar
3. Si falla algún punto:
   - **Stock:** Probá otros keywords o pasá a AI
   - **AI:** Ajustá el prompt (a veces cambiar una o dos palabras alcanza)

### Paso 8 — Reportá al usuario

Mostrá:
- Screenshot del resultado
- Qué tipo de imagen se usó (AI o stock) y por qué
- El prompt utilizado
- Si tenés alternativas o sugerencias

---

## Cheat Sheet de Prompts por Sección

### Secciones con personas (lifestyle)

| Sección | Tipo | Prompt/Keywords |
|---|---|---|
| Hero principal | AI | `...prefijo lifestyle..., person smiling confidently, relaxed pose, solid warm beige background` |
| Accidentes Personales | AI | `...prefijo lifestyle..., active young person, confident expression, bright white studio background` |
| Cobertura Deportes | Stock | `person athletic studio portrait bright background` |
| Cobertura Viajes | Stock | `person travel portrait bright minimal background` |
| Testimonios | AI | `...prefijo lifestyle..., two friends laughing together, soft gradient background, candid moment` |
| Contacto | AI | `...prefijo lifestyle..., friendly person waving, bright warm studio, approachable expression` |
| Cards genéricas | Stock | `person portrait bright studio warm [tema específico]` |

### Secciones de features/producto (device mockup)

| Sección | Tipo | Prompt/Keywords |
|---|---|---|
| Feature con celular | AI | `...prefijo producto..., smartphone floating at angle, soft warm background` |
| Feature con persona | AI/Stock | `person holding phone, screen facing viewer, bright studio, warm tones` |
| Feature con tablet | AI | `...prefijo producto..., tablet on clean desk, screen facing viewer, minimal workspace` |
| FAQ / Ayuda | AI | `...prefijo producto..., help center app screen, clean search interface, warm tones` |
| Descargá la app | AI | `...prefijo producto..., smartphone showing app home screen, tilted angle, soft gradient background` |

---

## Reglas de Oro

1. **Siempre usá el prefijo obligatorio** en prompts AI. Es lo que mantiene la coherencia visual en todo el sitio.
2. **Nunca uses imágenes que muestren accidentes o situaciones negativas.** Woranz vende tranquilidad, no miedo.
3. **Verificá visualmente cada imagen.** Los generadores AI a veces producen artefactos — siempre screenshot final.
4. **Priorizá personas reales sobre ilustraciones.** La marca es humana, no abstracta.
5. **Menos es más.** Una buena imagen con mucho aire vale más que una imagen recargada con muchos elementos.
6. **Coherencia > perfección.** Es mejor una imagen "buena" que sigue la línea que una imagen "increíble" que no encaja con el resto.
