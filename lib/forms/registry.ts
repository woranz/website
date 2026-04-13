import type { FormConfig } from "./types"

import { caucionesTradicionales } from "./configs/cauciones-tradicionales"
import { incendio } from "./configs/incendio"
import { roboBici } from "./configs/robo-bici"
import { roboCelular } from "./configs/robo-celular"
import { roboNotebook } from "./configs/robo-notebook"
import { seguroDeHogar } from "./configs/seguro-de-hogar"

const configs: Record<string, FormConfig> = {
  [caucionesTradicionales.id]: caucionesTradicionales,
  [incendio.id]: incendio,
  [roboBici.id]: roboBici,
  [roboCelular.id]: roboCelular,
  [roboNotebook.id]: roboNotebook,
  [seguroDeHogar.id]: seguroDeHogar,
}

export function getFormConfig(id: string): FormConfig | undefined {
  return configs[id]
}
