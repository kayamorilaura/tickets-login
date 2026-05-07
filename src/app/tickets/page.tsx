"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { TicketFilters } from "@/components/dashboard/TicketFilters"
import { Ticket } from "lucide-react"

export default function TicketsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">A carregar...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Ticket className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Todos os Tickets</h1>
        </div>
        <p className="text-sm text-gray-500">
          Visualização completa de todos os tickets do sistema.
        </p>
        <TicketFilters />
      </div>
    </MainLayout>
  )
}
