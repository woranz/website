"use client"

import { Agentation } from "agentation"

export function AgentationDevtools() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const endpoint =
    process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT?.trim() ||
    "http://localhost:4747"

  return <Agentation endpoint={endpoint} />
}
