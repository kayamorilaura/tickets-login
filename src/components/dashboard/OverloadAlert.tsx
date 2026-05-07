"use client"

import React from "react"
import { AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface OverloadAlertProps {
  isOverloaded: boolean
  technicianName?: string
  waitTime?: string
}

export function OverloadAlert({ isOverloaded, technicianName, waitTime }: OverloadAlertProps) {
  if (!isOverloaded) return null

  return (
    <div className="space-y-3">
      {/* Banner de sobrecarga */}
      <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-red-700">Sobrecarregamento detectado</h4>
          <p className="text-sm text-red-600 mt-0.5">
            {technicianName || "Técnico"} foi atribuído com apenas 1 slot disponível. 
            Tempo de espera aumentado.
          </p>
        </div>
      </div>

      {/* Banner de tempo de espera */}
      {waitTime && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm font-medium text-white tabular-nums">10:38:32</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm text-blue-700">
              Seu tempo de espera: <span className="font-semibold">~{waitTime}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
