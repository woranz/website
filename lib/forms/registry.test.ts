import { describe, expect, it } from "vitest"

import { buildContactFormSchema } from "@/lib/api/schemas/forms"
import { getFormConfig } from "@/lib/forms/registry"

describe("producer signup form config", () => {
  it("registers the productores signup form", () => {
    const config = getFormConfig("productores-registro")

    expect(config).toBeDefined()
    expect(config?.submitLabel).toBe("Quiero sumarme")
  })

  it("requires the minimum producer signup fields", () => {
    const config = getFormConfig("productores-registro")

    if (!config) {
      throw new Error("Missing productores-registro form config")
    }

    const schema = buildContactFormSchema(config)

    expect(
      schema.safeParse({
        _formId: "productores-registro",
        nombre: "Marcos Moreira",
        email: "marcos@woranz.com",
        telefono: "1123456789",
        provincia: "buenos-aires",
        perfil: "cartera-propia",
        matricula: "",
        comentarios: "",
      }).success
    ).toBe(true)

    expect(
      schema.safeParse({
        _formId: "productores-registro",
        nombre: "Marcos Moreira",
        email: "marcos@woranz.com",
        telefono: "1123456789",
        provincia: "",
        perfil: "",
        matricula: "",
        comentarios: "",
      }).success
    ).toBe(false)
  })
})
