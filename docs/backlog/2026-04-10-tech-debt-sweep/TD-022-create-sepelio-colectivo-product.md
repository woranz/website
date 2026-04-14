# TD-022 - Create Sepelio Colectivo product page

Prioridad: Media
Tipo: Producto / Content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: crear el producto en Sanity y la ruta correspondiente.
- Visual: no aplica (usa el template de producto existente)

## Problema

El producto "Sepelio Colectivo" existe en el catálogo de Woranz (segmento Empresas) pero no tiene página en el sitio nuevo. La legacy URL `/coberturas/seguro-de-sepelio/` necesita un destino válido para el redirect definido en TD-010.

## Evidencia

- El contenido está disponible en `.context/attachments/Woranz_Contenidos_Web (1).docx` bajo "Sepelio Colectivo" en la sección Empresas.
- TD-010 define el redirect: `/coberturas/seguro-de-sepelio/` → `/empresas/coberturas/sepelio-colectivo`.
- El home de empresas ya menciona "Sepelio Colectivo" como producto del bloque "Tu equipo".

## Alcance propuesto

- Crear el documento `producto` en Sanity con slug `sepelio-colectivo`, segmento `empresas`.
- Cargar contenido: título, bajada, qué es, coberturas.
- La página usa el template de producto existente (`components/templates/product-page.tsx`), no requiere diseño nuevo.

## Contenido

- **Título**: Un llamado, y está resuelto
- **Bajada**: En un momento difícil, lo operativo no puede ser un problema.
- **Qué es**: El seguro de sepelio colectivo brinda cobertura y asistencia ante el fallecimiento de un empleado o miembro del grupo asegurado, resolviendo la gestión del servicio o reintegrando los gastos. Es un complemento natural del seguro de vida, que simplifica un proceso sensible para la familia y la organización.
- **Coberturas**: Servicio prestacional, Reintegro de gastos, Cobertura para grupo familiar (según plan)

## Criterio de aceptacion

- Existe la ruta `/empresas/coberturas/sepelio-colectivo` con contenido completo.
- El redirect legacy `/coberturas/seguro-de-sepelio/` llega al destino correcto.
- El producto aparece en la navegación del segmento empresas.

## Validacion

- Smoke manual de ruta.
- Verificación de contenido contra el docx fuente.
