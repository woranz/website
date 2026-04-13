# APP-002 - Simplify AP quoter on mobile and tablet

Prioridad: Alta
Tipo: UX / Responsive / Form IA
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: ajustar el contrato y layout del quoter para reducir fricción en mobile y corregir la experiencia tablet.
- Visual: si
- Owner visual: Claude
- Entregable visual: redefinir jerarquía, agrupación y densidad del quoter en tablet y mobile sin degradar desktop.

## Problema

El cotizador inline de AP hoy expone demasiados campos en mobile y además no resuelve bien el estado intermedio de tablet. El feedback marca tanto exceso de inputs como un problema claro de presentación en pantallas medianas.

## Evidencia

- `components/Quoter.tsx:165-260` renderiza en mobile:
  - `Actividad`
  - `Provincia`
  - `Vigencia`
  - `Cantidad de personas`
- `components/Quoter.tsx:265-340` arma desktop como una sola fila ancha con cuatro controles y CTA lateral.
- Feedback recibido:
  - `Tiene campos de más en mobile.`
  - `No se ve bien en tablet.`

## Riesgo

- La conversión puede caer por exceso de fricción en mobile.
- Tablet queda atrapado entre dos layouts que no priorizan bien ancho, lectura ni acciones.
- Si se saca información sin criterio, puede romper el flujo de cotización o el handoff a la pantalla siguiente.

## Alcance propuesto

- Revisar qué campos son realmente necesarios en el primer paso del quoter mobile.
- Definir un comportamiento específico para tablet en lugar de depender solo del corte actual `md`.
- Reagrupar inputs y CTA para reducir ruido visual y mejorar progresión.
- Mantener alineación con el flujo de AP cotización existente.

## Criterio de aceptacion

- El quoter en mobile muestra menos fricción y menos densidad que el estado actual.
- Tablet deja de verse como una compresión incómoda del layout desktop.
- El flujo sigue permitiendo avanzar correctamente a la cotización.
- Desktop no se degrada con los cambios responsive.

## Validacion

- Smoke visual en mobile, tablet y desktop.
- Prueba manual del flujo hasta la pantalla de cotización.
- Revisión del número de campos visibles en mobile frente al estado actual.
