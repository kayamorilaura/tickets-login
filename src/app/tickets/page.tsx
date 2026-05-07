"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { TicketFilters } from "@/components/dashboard/TicketFilters"
import { Ticket } from "lucide-react"
import { mockTickets, mockUsers } from "@/lib/mockData"

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

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Título</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Urgência</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Atribuído a</th>
                <th className="px-5 py-3">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
              {mockTickets.map((ticket) => {
                const assigned = mockUsers.find((user) => user.id === ticket.assignedTo)
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-5 py-4">{ticket.title}</td>
                    <td className="px-5 py-4">{ticket.category}</td>
                    <td className="px-5 py-4">{ticket.urgency}</td>
                    <td className="px-5 py-4">{ticket.status}</td>
                    <td className="px-5 py-4">{assigned?.name ?? "—"}</td>
                    <td className="px-5 py-4">{ticket.createdAt.toLocaleDateString("pt-PT")}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
