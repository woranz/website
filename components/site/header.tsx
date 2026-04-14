"use client"

import Link from "next/link"
import {
  Bike,
  Building,
  Container,
  FileCheck,
  Flame,
  Gavel,
  Home,
  Key,
  Laptop,
  LogIn,
  Menu,
  Plane,
  Scale,
  Shield,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  Users,
  Heart,
  Cpu,
  Handshake,
  GraduationCap,
} from "lucide-react"

import { Logo } from "@/components/site/logo"
import { useActiveSegment } from "@/components/site/segment-tabs"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { ProductSegment } from "@/lib/product-paths"

export type SiteNavLink = {
  href: string
  label: string
}

export type NavCoverageItem = {
  title: string
  description: string
  href: string
  icon?: string
}

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  key: Key,
  home: Home,
  shield: Shield,
  flame: Flame,
  "graduation-cap": GraduationCap,
  smartphone: Smartphone,
  bike: Bike,
  laptop: Laptop,
  "file-check": FileCheck,
  users: Users,
  "shield-check": ShieldCheck,
  scale: Scale,
  store: Store,
  building: Building,
  container: Container,
  plane: Plane,
  handshake: Handshake,
  heart: Heart,
  cpu: Cpu,
  gavel: Gavel,
}

type SiteHeaderProps = {
  links: SiteNavLink[]
  loginHref?: string
  loginLabel?: string
}

const NAV_COVERAGE: Record<"personas" | "empresas", NavCoverageItem[]> = {
  personas: [
    { title: "Caución de Alquiler", description: "Tu garantía en 24hs.", href: "/personas/coberturas/caucion-alquiler", icon: "key" },
    { title: "Seguro de Hogar", description: "Tu casa cubierta.", href: "/personas/coberturas/seguro-de-hogar", icon: "home" },
    { title: "Accidentes Personales", description: "Cobertura ante imprevistos.", href: "/personas/coberturas/accidentes-personales", icon: "shield" },
    { title: "Incendio", description: "Protegé tu propiedad.", href: "/personas/coberturas/incendio", icon: "flame" },
    { title: "Turismo Estudiantil", description: "El viaje respaldado.", href: "/personas/coberturas/caucion-turismo-estudiantil", icon: "graduation-cap" },
    { title: "Robo de Celular", description: "Tu celu cubierto.", href: "/personas/coberturas/robo-celular", icon: "smartphone" },
    { title: "Robo de Bici", description: "Tu bici asegurada.", href: "/personas/coberturas/robo-bici", icon: "bike" },
    { title: "Robo de Notebook", description: "Tu herramienta protegida.", href: "/personas/coberturas/robo-notebook", icon: "laptop" },
  ],
  empresas: [
    { title: "Cauciones Tradicionales", description: "Garantías para operar.", href: "/empresas/coberturas/cauciones-tradicionales", icon: "file-check" },
    { title: "Garantía Aduanera", description: "Garantías para operar en aduana.", href: "/empresas/coberturas/garantias-aduaneras", icon: "container" },
    { title: "Caución Judicial", description: "Garantías para procesos judiciales.", href: "/empresas/coberturas/caucion-judicial", icon: "gavel" },
    { title: "Vida Colectivo", description: "Todo tu equipo cubierto.", href: "/empresas/coberturas/seguro-de-vida-empresas", icon: "users" },
    { title: "Accidentes Personales", description: "Dentro y fuera del trabajo.", href: "/empresas/coberturas/accidentes-personales", icon: "shield-check" },
    { title: "Responsabilidad Civil", description: "Operá tranquilo.", href: "/empresas/coberturas/responsabilidad-civil", icon: "scale" },
    { title: "Incendio", description: "Protegé tu operación.", href: "/empresas/coberturas/incendio", icon: "flame" },
    { title: "Integral de Comercio", description: "Tu negocio en una póliza.", href: "/empresas/coberturas/integral-de-comercio", icon: "store" },
    { title: "Hecho por Humanos", description: "Intervención humana verificable.", href: "/empresas/coberturas/hecho-por-humanos", icon: "handshake" },
    { title: "RC por uso de IA", description: "Cobertura para IA.", href: "/empresas/coberturas/responsabilidad-civil-uso-ia", icon: "cpu" },
    { title: "Sepelio Colectivo", description: "Cobertura para tu equipo.", href: "/empresas/coberturas/seguro-de-sepelio", icon: "heart" },
  ],
}

function SiteHeader({
  links,
  loginHref = "#",
  loginLabel = "Ingresar",
}: SiteHeaderProps) {
  const segment = useActiveSegment()
  const navSegment = segment === "productores" ? "personas" : segment
  const coverageItems = NAV_COVERAGE[navSegment]
  const otherLinks = links.filter(
    (l) => l.label !== "Coberturas" && l.label !== "Seguros"
  )

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-50 hidden border-b border-transparent bg-white md:block">
        <div className="page-shell flex-row items-center justify-between px-page py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Coberturas dropdown — first */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 bg-transparent px-3 py-1.5 text-body font-medium text-woranz-ink shadow-none ring-0 hover:bg-transparent hover:text-woranz-slate focus:bg-transparent data-popup-open:bg-transparent data-popup-open:text-woranz-slate data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent">
                    Coberturas
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0">
                    <div className="w-[640px] p-6">
                      <div className="grid grid-cols-2 gap-10">
                        {(["personas", "empresas"] as const).map((seg) => (
                          <div key={seg} className="flex flex-col gap-3">
                            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-woranz-text/50">
                              {seg === "personas" ? "Personas" : "Empresas"}
                            </span>
                            <div className="flex flex-col">
                              {NAV_COVERAGE[seg].map((item) => {
                                const Icon = item.icon ? NAV_ICONS[item.icon] : null
                                return (
                                  <NavigationMenuLink
                                    key={item.title}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-woranz-warm-1"
                                  >
                                    {Icon ? (
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-woranz-warm-1 text-woranz-slate">
                                        <Icon className="h-4 w-4" />
                                      </span>
                                    ) : null}
                                    <span className="text-[14px] font-medium text-woranz-ink">
                                      {item.title}
                                    </span>
                                  </NavigationMenuLink>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Rest of links */}
                {otherLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex h-9 items-center px-3 py-1.5 text-body font-medium text-woranz-ink transition-colors hover:text-woranz-slate"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Link href={loginHref} className="btn-header">
              <LogIn className="h-4 w-4" />
              <span>{loginLabel}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="sticky top-0 z-50 border-b border-transparent bg-white md:hidden">
        <div className="page-shell flex-row items-center justify-between px-5 py-4">
          <Sheet>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full text-woranz-slate transition-colors hover:bg-woranz-warm-1">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </SheetTrigger>
            <SheetContent className="max-w-none overflow-y-auto px-0" side="left">
              <SheetHeader>
                <Logo size="small" />
                <SheetTitle className="sr-only">Menú principal</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-6 pt-6">
                {/* Coberturas accordion — first */}
                <Accordion>
                  <AccordionItem value="coberturas" className="border-none">
                    <AccordionTrigger className="p-0 text-xl font-medium text-woranz-ink hover:no-underline">
                      Coberturas
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 pb-0">
                      <div className="flex flex-col gap-1">
                        {coverageItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex flex-col gap-0.5 rounded-lg py-2.5"
                          >
                            <span className="text-base font-semibold text-woranz-ink">
                              {item.title}
                            </span>
                            <span className="text-sm leading-snug text-woranz-text">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {otherLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xl font-medium text-woranz-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <SheetFooter>
                <Link href={loginHref} className="btn-primary-form w-full text-center">
                  {loginLabel}
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Logo size="small" />

          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-woranz-warm-1 text-woranz-slate">
            <User className="h-5 w-5" />
          </div>
        </div>
      </header>
    </>
  )
}

export { SiteHeader }
