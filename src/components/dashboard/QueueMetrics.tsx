"use client"

import React from "react"
import { Clock, Users, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCard {
  label: string
  value: number
  sublabel: string
  color: "yellow" | "purple" | "red" | "orange" | "green"
  icon: React.ReactNode
}

const metrics: MetricCard[] = [
  {
    label: "Em Fila",
    value: 0,
    sublabel: "aguardando",
    color: "yellow",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    label: "IT Disponíveis",
    value: 3,
    sublabel: "não em férias",
    color: "purple",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "Urgência Alta",
    value: 0,
    sublabel: "tickets em fila",
    color: "red",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    label: "Urgência Média",
    value: 0,
    sublabel: "tickets em fila",
    color: "orange",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    label: "Urgência Baixa",
    value: 0,
    sublabel: "tickets em fila",
    color: "green",
    icon: <AlertCircle className="h-4 w-4" />,
  },
]

const colorMap = {
  yellow: {
    dot: "bg-yellow-400",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  purple: {
    dot: "bg-purple-400",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  red: {
    dot: "bg-red-400",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  orange: {
    dot: "bg-orange-400",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  green: {
    dot: "bg-green-400",
    bg: "bg-green-50",
    text: "text-green-700",
  },
}

export function QueueMetrics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <h3 className="text-base font-semibold text-gray-900">Métricas da Fila de Espera</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((metric) => {
          const colors = colorMap[metric.color]
          return (
            <Card
              key={metric.label}
              className="bg-white border-gray-100 shadow-sm overflow-hidden"
            >
              <CardContent className="p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">{metric.label}</span>
                  <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-400">{metric.sublabel}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
