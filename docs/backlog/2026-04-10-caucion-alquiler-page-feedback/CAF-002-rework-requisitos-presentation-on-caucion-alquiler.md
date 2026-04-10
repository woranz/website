# CAF-002 - Rework requisitos presentation on caucion alquiler

Prioridad: P0
Tipo: UX / IA / Content structure
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: cambiar la estructura del bloque `Requisitos` para que deje de renderizar un acordeón por item y pase a una composición acorde al contenido real.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la mejor composición final del bloque para desktop y mobile sin perder escaneabilidad.

## Problema

`Requisitos` está modelado como una lista de strings simples, pero se renderiza como dos columnas de acordeones con un trigger por requisito y sin contenido expandible real. El feedback pidió borrar ese patrón actual y resolverlo como un solo dropdown con todos los requisitos o de otra manera más clara.

## Evidencia

- `data/product-catalog.json:32-42` define `requisitos.items` como strings simples, sin descripción adicional por item.
- `components/templates/product-page.tsx:394-418` reparte esos items en dos columnas para desktop y una columna para mobile.
- `components/templates/product-page.tsx:423-460` renderiza cada string como `AccordionItem`, aunque `item.description` queda vacío en este bloque.
- Feedback recibido:
  - Sobre un item del acordeón actual: "Borrar"
  - Sobre la sección: "Requisitos: hacer un solo dropdown con todos los requisitos o mostrarlo de otra manera."

## Riesgo

- Se introduce interacción innecesaria para contenido que en realidad es una lista plana.
- El bloque pierde escaneabilidad y ocupa más alto visual del necesario.
- La UI sugiere detalle expandible aunque no existe contenido adicional por requisito.

## Alcance propuesto

- Reemplazar el patrón actual de acordeón por item por una composición alineada al contenido real.
- Resolver el bloque como un solo disclosure con la lista completa o como una lista estática si esa opción resulta más clara.
- Eliminar los triggers repetidos actuales que hoy no aportan información.
- Aprovechar el ajuste para revisar si algún requisito debe consolidarse o editarse durante el pase de copy.

## Criterio de aceptacion

- `Requisitos` deja de mostrar un acordeón separado por cada string.
- La solución final presenta todos los requisitos de forma clara en desktop y mobile.
- No quedan panels vacíos ni affordances engañosas en esta sección.
- El bloque resultante mejora el escaneo y reduce ruido visual frente al estado actual.

## Validacion

- Revisión visual en desktop y mobile de `/personas/coberturas/caucion-alquiler`.
- Verificación estática del componente para confirmar que `Requisitos` no reutiliza el patrón actual de `AccordionColumn`.
- QA manual del bloque con foco en claridad de lectura y densidad visual.
