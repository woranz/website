"use client"

import { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

const ALL_TEAM_MEMBERS = [
  { name: "Ariel", src: "/images/team/ariel.webp" },
  { name: "Carolina", src: "/images/team/carolina.webp" },
  { name: "Charlie", src: "/images/team/charlie.webp" },
  { name: "Debo", src: "/images/team/debo.webp" },
  { name: "Eliana", src: "/images/team/eliana.webp" },
  { name: "Emi", src: "/images/team/emi.webp" },
  { name: "Ezequiel", src: "/images/team/ezequiel.webp" },
  { name: "Gianella", src: "/images/team/gianella.webp" },
  { name: "Gonzalo", src: "/images/team/gonzalo.webp" },
  { name: "Herman", src: "/images/team/herman.webp" },
  { name: "Josefina", src: "/images/team/josefina.webp" },
  { name: "Marcelo", src: "/images/team/marcelo.webp" },
  { name: "María del Mar", src: "/images/team/mariadelMar.webp" },
  { name: "Marianela", src: "/images/team/marianela.webp" },
  { name: "Mariela", src: "/images/team/mariela.webp" },
  { name: "Mario", src: "/images/team/mario.webp" },
  { name: "Martina", src: "/images/team/martina.webp" },
  { name: "Meli", src: "/images/team/meli.webp" },
  { name: "Melu", src: "/images/team/melu.webp" },
  { name: "Micaela", src: "/images/team/micaela.webp" },
  { name: "Priscilla", src: "/images/team/priscilla.webp" },
  { name: "Sebas", src: "/images/team/sebas.webp" },
  { name: "Valentina", src: "/images/team/valentina.webp" },
  { name: "Vanesa", src: "/images/team/vanesa.webp" },
  { name: "Yasmin", src: "/images/team/yasmin.webp" },
]

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function TeamAvatars({
  count = 4,
  teamCount,
  teamLabel,
}: {
  count?: number
  teamCount?: string
  teamLabel?: string
}) {
  const [members, setMembers] = useState(ALL_TEAM_MEMBERS.slice(0, count))

  useEffect(() => {
    setMembers(shuffle(ALL_TEAM_MEMBERS).slice(0, count))
  }, [count])

  const remaining = ALL_TEAM_MEMBERS.length - count
  const displayCount = teamCount ?? `+${remaining}`

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:gap-0">
      <AvatarGroup>
        {members.map((member) => (
          <Avatar
            key={member.name}
            size="lg"
            className="avatar-stack-item -ml-2 ring-0"
          >
            <AvatarImage src={member.src} alt={member.name} />
            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount className="h-[52px] w-[52px] border-[3px] border-white bg-woranz-yellow text-sm font-bold text-woranz-ink ring-0 md:text-base">
          {displayCount}
        </AvatarGroupCount>
      </AvatarGroup>
      {teamLabel && (
        <span className="text-sm font-medium text-woranz-text md:pl-6 md:text-body">
          {teamLabel}
        </span>
      )}
    </div>
  )
}
