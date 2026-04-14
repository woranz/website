"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { ProductGridItem } from "@/lib/product-pages"

export function ProductSearchList({
  title,
  items,
}: {
  title: string
  items: ProductGridItem[]
}) {
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? items.filter((item) =>
        item.title.toLowerCase().includes(query.trim().toLowerCase())
      )
    : items

  return (
    <section id="coberturas" className="w-full scroll-mt-20">
      <div className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2 className="section-title">{title}</h2>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-woranz-text" />
            <Input
              type="search"
              placeholder="Buscar cobertura..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-11 text-[15px]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Search className="h-8 w-8 text-woranz-text/40" />
            <p className="text-center text-[15px] text-woranz-text">
              No encontramos coberturas con &ldquo;{query.trim()}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {filtered.map((item) => {
              const card = (
                <div className="group flex items-center gap-4 rounded-2xl bg-woranz-warm-1 p-3 transition-colors hover:bg-woranz-warm-2 md:gap-5 md:p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-woranz-warm-3 to-woranz-warm-1 md:h-20 md:w-20">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold leading-tight text-woranz-ink md:text-base">
                        {item.title}
                      </p>
                      {item.subtitle ? (
                        <p className="mt-1 line-clamp-2 text-sm leading-snug text-woranz-text">
                          {item.subtitle}
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="mr-1 h-4 w-4 shrink-0 text-woranz-text transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              )

              return item.href ? (
                <Link key={item.title} href={item.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={item.title}>{card}</div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
