import type { FormConfig } from "./types"

import { caucionesTradicionales } from "./configs/cauciones-tradicionales"

const configs: Record<string, FormConfig> = {
  [caucionesTradicionales.id]: caucionesTradicionales,
}

export function getFormConfig(id: string): FormConfig | undefined {
  return configs[id]
}
