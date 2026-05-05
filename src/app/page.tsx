"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { TicketFilters } from "@/components/dashboard/TicketFilters"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { QueueMetrics } from "@/components/dashboard/QueueMetrics"
import { LoadDistribution } from "@/components/dashboard/LoadDistribution"
import { OverloadAlert } from "@/components/dashboard/OverloadAlert"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">A carregar...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Mock: verificar sobrecarga (em produção viria do backend)
  const isOverloaded = false // mudar para true para testar

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {user?.name || "Utilizador"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os seus tickets de IT de forma eficiente
          </p>
        </div>

        {/* Alerta de Sobrecarga */}
        <OverloadAlert 
          isOverloaded={isOverloaded} 
          technicianName={user?.name}
          waitTime="22 min"
        />

        {/* Ticket List Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lista de Tickets</h2>
          <TicketFilters />
        </section>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Queue Metrics */}
        <QueueMetrics />

        {/* Load Distribution */}
        <LoadDistribution />
      </div>
    </MainLayout>
  )
}
