import type { FormConfig } from "./types"

import { aeronavegacion } from "./configs/aeronavegacion"
import { caucionJudicial } from "./configs/caucion-judicial"
import { caucionesTradicionales } from "./configs/cauciones-tradicionales"
import { garantiasAduaneras } from "./configs/garantias-aduaneras"
import { incendio } from "./configs/incendio"
import { roboBici } from "./configs/robo-bici"
import { roboCelular } from "./configs/robo-celular"
import { roboNotebook } from "./configs/robo-notebook"
import { seguroDeHogar } from "./configs/seguro-de-hogar"

const configs: Record<string, FormConfig> = {
  [aeronavegacion.id]: aeronavegacion,
  [caucionJudicial.id]: caucionJudicial,
  [caucionesTradicionales.id]: caucionesTradicionales,
  [garantiasAduaneras.id]: garantiasAduaneras,
  [incendio.id]: incendio,
  [roboBici.id]: roboBici,
  [roboCelular.id]: roboCelular,
  [roboNotebook.id]: roboNotebook,
  [seguroDeHogar.id]: seguroDeHogar,
}

export function getFormConfig(id: string): FormConfig | undefined {
  return configs[id]
}
