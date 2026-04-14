import { APCotizacionExito } from "@/components/APCotizacionExito"
import { buildProductPath } from "@/lib/product-paths"

export default function CotizacionAPExitoPage() {
  return (
    <APCotizacionExito baseHref={buildProductPath("personas", "accidentes-personales")} />
  )
}
