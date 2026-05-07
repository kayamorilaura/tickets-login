"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { mockTickets } from "@/lib/mockData"

const ticketsByCategory = Object.entries(
  mockTickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1
    return acc
  }, {})
).map(([name, value]) => ({
  name,
  value,
  color:
    name === "Hardware"
      ? "#3b82f6"
      : name === "Software"
      ? "#8b5cf6"
      : name === "Rede"
      ? "#ec4899"
      : name === "Segurança"
      ? "#f59e0b"
      : "#6b7280",
}))

const urgencyDistribution = Object.entries(
  mockTickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.urgency] = (acc[ticket.urgency] || 0) + 1
    return acc
  }, {})
).map(([name, value]) => ({
  name: name === "high" ? "Alta" : name === "medium" ? "Média" : "Baixa",
  value,
  color: name === "high" ? "#ef4444" : name === "medium" ? "#f59e0b" : "#10b981",
}))

const ticketsOverTime = mockTickets.map((ticket) => ({
  month: ticket.createdAt.toLocaleString("pt-PT", { month: "short" }),
  open: ticket.status === "open" ? 1 : 0,
  closed: ticket.status === "closed" ? 1 : 0,
  pending: ticket.status === "open" ? 0 : 0,
}))

const ticketStatusMetrics = [
  {
    label: "Abertos",
    value: mockTickets.filter((ticket) => ticket.status === "open").length,
    color: "bg-blue-100",
    icon: Clock,
    textColor: "text-blue-600",
  },
  {
    label: "Resolvidos",
    value: mockTickets.filter((ticket) => ticket.status === "closed").length,
    color: "bg-green-100",
    icon: CheckCircle,
    textColor: "text-green-600",
  },
  {
    label: "Pendentes",
    value: mockTickets.filter((ticket) => ticket.status === "open" || ticket.status === "passed").length,
    color: "bg-yellow-100",
    icon: AlertCircle,
    textColor: "text-yellow-600",
  },
  {
    label: "Total",
    value: mockTickets.length,
    color: "bg-purple-100",
    icon: TrendingUp,
    textColor: "text-purple-600",
  },
]

const technicianPerformance = [
  { name: "Laura Kayamori", resolved: 12, pending: 2, avg_time: "2.4h" },
  { name: "Pedro Silva", resolved: 9, pending: 3, avg_time: "2.8h" },
  { name: "Mariana Costa", resolved: 7, pending: 4, avg_time: "3.1h" },
]

export default function EstatisticasPage() {
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Análise detalhada de tickets e desempenho
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ticketStatusMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="bg-white border-gray-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.color}`}>
                      <Icon className={`h-6 w-6 ${metric.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets Over Time */}
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Tickets ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="open" stroke="#3b82f6" strokeWidth={2} name="Abertos" />
                  <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} name="Fechados" />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pendentes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tickets by Category */}
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Tickets por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ticketsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Urgency Distribution */}
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Distribuição de Urgência</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={urgencyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="value" fill="#3b82f6">
                    {urgencyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Technician Performance */}
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Desempenho dos Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicianPerformance.map((tech) => (
                  <div key={tech.name} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{tech.name}</p>
                      <span className="text-xs text-gray-500">Tempo médio: {tech.avg_time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Resolvidos</p>
                        <p className="text-lg font-bold text-green-600">{tech.resolved}</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Pendentes</p>
                        <p className="text-lg font-bold text-yellow-600">{tech.pending}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
