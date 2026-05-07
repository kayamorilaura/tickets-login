"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Technician {
  name: string
  tickets: number
}

const technicians: Technician[] = [
  { name: "the great white knight", tickets: 0 },
  { name: "Laura Kayamori", tickets: 0 },
  { name: "Pedro Cipriano", tickets: 0 },
]

const maxTickets = 10

export function LoadDistribution() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Distribuição de Carga</h3>

      <div className="space-y-3">
        {technicians.map((tech) => {
          const percentage = Math.min((tech.tickets / maxTickets) * 100, 100)
          return (
            <div key={tech.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 w-40 truncate flex-shrink-0">
                {tech.name}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    percentage === 0 ? "bg-gray-200" : "bg-purple-400"
                  )}
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                />
              </div>
              <Badge
                variant="success"
                className="flex-shrink-0 text-xs px-2.5 py-0.5"
              >
                {tech.tickets} tickets
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
