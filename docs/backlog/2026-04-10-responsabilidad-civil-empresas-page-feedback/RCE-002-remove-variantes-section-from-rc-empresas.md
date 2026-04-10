# RCE-002 - Remove variantes section from RC empresas

Prioridad: Alta
Tipo: IA / Content architecture / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: remover la sección `Variantes` de `responsabilidad-civil` sin perder cobertura de información clave en otras superficies de la página.
- Visual: si
- Owner visual: Claude
- Entregable visual: recomponer el ritmo de la página una vez eliminado el bloque para que no quede un vacío entre secciones.

## Problema

La página de `responsabilidad-civil` hoy incluye una sección `Variantes`, pero el feedback pide eliminarla. En este producto, además, ya existe un bloque de `coberturas`, así que mantener ambos puede resultar redundante.

## Evidencia

- `data/product-catalog.json:1225-1243` define una lista de `variantes` para `responsabilidad-civil`.
- `data/product-catalog.json:1258-1282` define además una lista de `coberturas` para la misma página.
- Feedback recibido: `Eliminar sección variantes.`

## Riesgo

- La coexistencia de `variantes` y `coberturas` puede duplicar información y volver más ruidosa la página.
- Si se elimina sin revisar continuidad narrativa, puede quedar un salto brusco entre hero y bloques siguientes.
- Si alguna información vive solo en `variantes`, se puede perder contexto útil.

## Alcance propuesto

- Eliminar la sección `Variantes` de la página.
- Revisar si alguna parte del contenido necesita reubicarse o condensarse en otro bloque.
- Asegurar que la página siga explicando el producto con suficiente claridad.
- Validar el impacto sobre el layout general de la página.

## Criterio de aceptacion

- `/empresas/coberturas/responsabilidad-civil` ya no muestra la sección `Variantes`.
- La página conserva claridad sobre el producto sin depender de ese bloque.
- No quedan huecos de composición ni duplicaciones editoriales evidentes.
- El flujo visual sigue funcionando en desktop y mobile.

## Validacion

- Smoke visual en desktop y mobile.
- Verificación estática de que `variantes` dejó de renderizarse para esta página.
- Revisión rápida de continuidad narrativa tras remover el bloque.
