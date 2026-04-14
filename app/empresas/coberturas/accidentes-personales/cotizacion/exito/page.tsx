import { APCotizacionExito } from "@/components/APCotizacionExito"
import { buildProductPath } from "@/lib/product-paths"

export default function CotizacionAPEmpresasExitoPage() {
  return (
    <APCotizacionExito baseHref={buildProductPath("empresas", "accidentes-personales")} />
  )
}
