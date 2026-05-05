"use client"

import React from "react"
import { Zap, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const quickRequests = [
  { id: "QR-0001", title: "Redefinição de senha — VPN", requester: "Maria Oliveira", status: "Pendente" },
  { id: "QR-0002", title: "Instalar Adobe Reader", requester: "Pedro Costa", status: "Pendente" },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pedidos Rápidos Card */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Zap className="h-4 w-4 text-orange-600" />
              </div>
              <CardTitle className="text-base font-semibold text-gray-900">Pedidos Rápidos</CardTitle>
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {quickRequests.filter(r => r.status === "Pendente").length}/{quickRequests.length} Pendentes
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{req.title}</p>
                <p className="text-xs text-gray-500">{req.requester}</p>
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                {req.status}
              </span>
            </div>
          ))}
        </CardContent>
        <div className="px-5 pb-5">
          <Button
            variant="secondary"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            Ver Todos
          </Button>
        </div>
      </Card>

      {/* Processos Card */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <CardTitle className="text-base font-semibold text-gray-900">Processos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Onboardings</span>
            <span className="text-sm font-semibold text-gray-900">0/0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Alterações de Funções</span>
            <span className="text-sm font-semibold text-gray-900">0/0</span>
          </div>
        </CardContent>
        <div className="px-5 pb-5">
          <Button
            variant="secondary"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            Ver tudo
          </Button>
        </div>
      </Card>
    </div>
  )
}
