# EFQ-001 - Research de FAQs en competidores argentinos

## Task Classification

- `product-content`
- Stage activo: `Product`
- Output: corpus de FAQs por product page + research de soporte

## Objetivo

Detectar los patrones de preguntas frecuentes que ya usa el mercado argentino y traducirlos al catálogo de Woranz por:

- segmento (`personas` / `empresas`)
- tipo de cobertura
- tono Woranz

La meta no fue copiar FAQs literales, sino capturar las dudas recurrentes que hoy aparecen en competidores, bancos, aseguradoras y fuentes regulatorias locales.

## Metodología

1. Inventarié todas las páginas reales del catálogo en `data/product-catalog.json`.
2. Revisé qué páginas ya tenían FAQs y cuáles estaban vacías o subdesarrolladas.
3. Hice research en sitios argentinos por vertical.
4. Extraje patrones de duda repetidos.
5. Reescribí respuestas en tono Woranz y las apliqué por key `segmento/slug`.

## Hallazgos Por Vertical

### 1. Caución de alquiler

Patrones repetidos en competidores:

- si reemplaza garante propietario
- qué documentación se pide
- qué cubre además del alquiler
- si la aceptan inmobiliarias
- qué pasa si se rescinde antes
- tiempos de emisión

Aplicación en Woranz:

- `personas/caucion-alquiler`
- `empresas/caucion-alquiler-comercial`
- `empresas/caucion-alquiler-beneficios-corporativos`

### 2. Accidentes personales

Patrones repetidos:

- qué se considera accidente
- diferencia con ART o seguro de vida
- edades de ingreso
- alcance dentro y fuera del trabajo
- documentación ante siniestro

Aplicación en Woranz:

- `personas/accidentes-personales`
- `empresas/accidentes-personales`

### 3. Hogar / incendio / bienes personales

Patrones repetidos:

- qué cubre realmente la póliza
- diferencia entre robo, hurto y extravío
- si aplica para inquilinos
- necesidad o no de inspección
- pasos de denuncia
- cómo se define reposición o indemnización

Aplicación en Woranz:

- `personas/seguro-de-hogar`
- `personas/incendio`
- `personas/robo-bici`
- `personas/robo-monopatin`
- `personas/robo-celular`
- `personas/robo-notebook`

### 4. Turismo estudiantil

Patrones repetidos:

- quién contrata la caución
- cómo valida la familia que la póliza existe
- qué cubre y qué no cubre
- vigencia del certificado de la agencia
- documentación necesaria para operar

Dato regulatorio relevante:

- el 7 de agosto de 2024 Argentina publicó el nuevo reglamento de turismo estudiantil
- el 27 de agosto de 2024 se habilitó la presentación digital del certificado
- el esquema nuevo reemplazó el sistema anterior por seguro de caución a favor del pasajero

Aplicación en Woranz:

- `personas/caucion-turismo-estudiantil`
- `empresas/caucion-turismo-estudiantil-agencias`

### 5. Vida, salud y sepelio colectivos

Patrones repetidos:

- diferencia entre obligatorio y opcional
- cómo se administran altas y bajas
- quién queda cubierto
- si reemplaza prepaga / obra social
- cómo se define capital o beneficio

Aplicación en Woranz:

- `empresas/seguro-de-vida-empresas`
- `empresas/seguro-de-salud`
- `empresas/seguro-de-sepelio`
- `empresas/vida-saldo-deudor`

### 6. Comercio, consorcio, incendio y RC para empresas

Patrones repetidos:

- qué riesgos incluye una póliza integral
- si cubre mercadería, partes comunes o terceros
- datos necesarios para cotizar
- necesidad de revisar sumas aseguradas
- diferencia entre RC general, profesional o producto

Aplicación en Woranz:

- `empresas/integral-de-comercio`
- `empresas/integral-de-consorcio`
- `empresas/incendio`
- `empresas/responsabilidad-civil`

### 7. Cauciones tradicionales

Patrones repetidos:

- qué obligación garantiza cada caución
- si reemplaza inmovilización de capital o aval bancario
- qué documentación analiza la aseguradora
- diferencias entre obra, servicios, suministro, judicial, aduanera y habilitante

Aplicación en Woranz:

- `empresas/caucion-servicios`
- `empresas/caucion-obra`
- `empresas/caucion-suministro`
- `empresas/garantias-aduaneras`
- `empresas/caucion-actividad-o-profesion`
- `empresas/caucion-judicial`
- `empresas/cauciones-tradicionales`

### 8. Nichos nuevos o sin benchmark directo

Sin equivalente local claro 1:1:

- `empresas/hecho-por-humanos`
- `empresas/responsabilidad-civil-uso-ia`

Criterio usado:

- tomé patrones de RC profesional / productos tecnológicos / validación humana
- armé FAQs más educativas, enfocadas en alcance, prueba de intervención humana, supervisión y convivencia con otras pólizas

## Principios De Redacción Aplicados

- voseo en `personas`
- tono más profesional pero directo en `empresas`
- respuestas cortas, sin jerga innecesaria
- sin prometer condiciones que no estén en la póliza
- cuando el mercado suele sobreafirmar, en Woranz lo llevé a fórmulas más responsables: `depende del plan`, `según la póliza`, `hay que revisar el alcance`

## Fuentes usadas

Primarias / mercado argentino:

- BBVA Seguros - Accidentes Personales: https://www.bbvaseguros.com.ar/seguros-personas/seguro-de-accidentes-personales/
- BBVA Seguros - Salud: https://www.bbvaseguros.com.ar/seguros-personas/seguro-de-salud/
- BBVA Seguros - Vida Colectivo Opcional: https://www.bbvaseguros.com.ar/seguros-empresas/seguro-de-vida-colectivo-opcional/
- BBVA Seguros - Atención al cliente / asistencias: https://www.bbvaseguros.com.ar/atencion-al-cliente/
- MAPFRE Argentina - FAQ de hogar: https://www.mapfre.com.ar/seguros-hogar/preguntas-frecuentes/
- Life Seguros - FAQ de caución alquiler: https://www.lifeseguros.com.ar/preguntas-frecuentes/
- Banco Nación - Garantía de Alquiler: https://www.bna.com.ar/Personas/GarantiaDeAlquiler
- ATM Seguros - Bicicletas: https://atmseguros.com.ar/coberturas/bicicletas/
- Allianz - Accidentes Personales: https://www.allianz.com.ar/seguros/profesionales/accidentes-personales.html
- Allianz - Integral de Comercio: https://www.allianz.com.ar/seguros/profesionales/integral-comercio.html
- Allianz - Consorcio: https://www.allianz.com.ar/blog-allianz/seguro-consorcio.html
- Chubb Argentina - Caución: https://www.chubb.com/ar-es/empresas/caucion.html

Regulación / contexto argentino:

- Argentina.gob.ar - Nuevo reglamento de turismo estudiantil: https://www.argentina.gob.ar/noticias/nuevo-reglamento-de-turismo-estudiantil-agiliza-la-actividad-del-sector
- Argentina.gob.ar - Presentación de solicitudes para certificado: https://www.argentina.gob.ar/noticias/ya-se-pueden-presentar-las-solicitudes-para-el-certificado-de-turismo-estudiantil
- Argentina.gob.ar - Información para usuarios de turismo estudiantil: https://www.argentina.gob.ar/interior/turismo/estudiantil/usuarios
- Argentina.gob.ar - Fechas de viaje y vigencia del certificado: https://www.argentina.gob.ar/jefatura/turismo/viajes-de-turismo-estudiantil/turismo-estudiantil-fechas-de-viaje
- Resolución 1/2024 - texto: https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1-2024-402532/texto

## Artefactos generados

- sync específico de FAQs a Sanity en [scripts/sync-product-faqs-to-sanity.mjs](/Users/marcos/conductor/workspaces/website/san-francisco/scripts/sync-product-faqs-to-sanity.mjs)
- FAQs ya sincronizadas en los documentos `producto` del dataset `production`
- research y fuentes en [docs/research/efq-001-argentina-faqs.md](/Users/marcos/conductor/workspaces/website/san-francisco/docs/research/efq-001-argentina-faqs.md)
