# TD-009 - Fix Tailwind ambiguous classes and motion tokens

Prioridad: Media
Tipo: Build hygiene / Frontend infra
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el comportamiento y la sensacion del dropdown no degraden al limpiar motion tokens.

## Problema

El build pasa, pero emite warnings de Tailwind por clases ambiguas en `components/ui/navigation-menu.tsx`. Eso deja deuda de higiene en una primitive central y hace mas fragil el mantenimiento de motion styles.

## Evidencia

- `npm run build` reporto warnings por `duration-[0.35s]`.
- `npm run build` reporto warnings por `ease-[cubic-bezier(0.22,1,0.36,1)]`.
- `components/ui/navigation-menu.tsx:87`, `111` y `116` concentran esas clases ambiguas.

## Riesgo

- Se acumula ruido en CI y cuesta detectar warnings nuevos realmente importantes.
- La primitive de navegacion queda apoyada en strings complejos y poco legibles.
- Motion tokens no quedan reutilizables en otros componentes.

## Alcance propuesto

- Resolver las clases ambiguas segun la sintaxis correcta o moviendo los valores a tokens/config.
- Centralizar easing y duration usadas por la navegacion.
- Verificar que la primitive no dependa de utilidades ambiguas para compilar limpia.

## Criterio de aceptacion

- `npm run build` corre sin esos warnings.
- La configuracion de motion queda expresiva y reutilizable.
- `components/ui/navigation-menu.tsx` mejora legibilidad.

## Validacion

- `npm run build`
- Revisión manual del dropdown de header en desktop.
