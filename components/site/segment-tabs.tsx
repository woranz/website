"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { ProductSegment } from "@/lib/product-paths"

const SEGMENTS = [
  { label: "Personas", href: "/", segment: "personas" as ProductSegment },
  { label: "Empresas", href: "/empresas", segment: "empresas" as ProductSegment },
  { label: "Productores", href: "/productores", segment: "productores" as ProductSegment },
] as const

function SegmentTabs() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/personas")
    }
    return pathname.startsWith(href)
  }

  const activeSegment = SEGMENTS.find((s) => isActive(s.href))?.segment ?? "personas"

  return (
    <nav className="flex w-full items-center justify-center px-page-mobile md:px-0">
      <div className="inline-flex w-full items-center gap-0 rounded-full bg-woranz-warm-3 p-1 md:w-auto">
        {SEGMENTS.map((segment) => (
          <Link
            key={segment.href}
            href={segment.href}
            className={cn(
              "flex-1 rounded-full py-2 text-center text-[13px] font-medium transition-all md:flex-none md:px-7 md:py-2.5 md:text-sm",
              isActive(segment.href)
                ? "bg-white font-semibold text-woranz-ink shadow-sm"
                : "text-woranz-ink/70 hover:text-woranz-ink"
            )}
          >
            {segment.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function useActiveSegment(): ProductSegment {
  const pathname = usePathname()
  if (pathname.startsWith("/empresas")) return "empresas"
  if (pathname.startsWith("/productores")) return "productores"
  return "personas"
}

export { SegmentTabs, useActiveSegment }
