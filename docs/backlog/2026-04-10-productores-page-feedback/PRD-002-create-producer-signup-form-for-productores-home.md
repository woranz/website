# PRD-002 - Create producer signup form for productores home

Prioridad: Alta
Tipo: Conversion / Form flow / Productores onboarding
Estado: Done (commit 0fb4c39)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir y montar un formulario de alta de productores como destino real del CTA `Empezar gratis`, incluyendo punto de entrada, campos y wiring operativo.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la presentacion del alta para que se perciba como onboarding claro y no como formulario generico.

## Problema

La pagina de `productores` promete un CTA primario de inicio gratuito, pero el feedback aclara que falta el alta real de productores. Sin ese flujo, la propuesta principal de conversion queda incompleta.

## Evidencia

- `app/productores/page.tsx:14-18` renderiza la home de productores con `ProductPageTemplate`.
- `lib/home-page-source.ts:207-210` resuelve CTAs del home desde contenido, pero no define un formulario de alta especifico.
- Feedback recibido: `Crear formulario de alta de productores.`

## Riesgo

- El CTA primario puede quedar como promesa vacia o derivar a un destino ambiguo.
- Si el alta se resuelve sin definir campos y ownership de datos, se crea un formulario dificil de operar.
- Una implementacion improvisada puede mezclar contacto comercial con onboarding de productores, que no es lo mismo.

## Alcance propuesto

- Definir el formulario de alta de productores como flujo real de conversion.
- Resolver si vive inline, como modal o en una pagina/step dedicado.
- Establecer campos minimos, canal de entrega y destino operativo del envio.
- Convertir ese flujo en el destino primario del hero de `/productores`.

## Criterio de aceptacion

- Existe un formulario de alta de productores definido como destino real de `Empezar gratis`.
- El flujo captura los datos minimos necesarios para iniciar alta comercial.
- El destino del CTA principal deja de ser ambiguo.
- La experiencia final es coherente con un onboarding de productores.

## Validacion

- Verificacion estatica del destino y wiring del CTA primario.
- Smoke manual del flujo de alta.
- Revision funcional de campos, envio y estado final del formulario.
