"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

// Mock data for charts
const ticketsOverTime = [
  { month: "Jan", open: 24, closed: 40, pending: 20 },
  { month: "Fev", open: 30, closed: 45, pending: 25 },
  { month: "Mar", open: 28, closed: 50, pending: 22 },
  { month: "Abr", open: 35, closed: 55, pending: 30 },
  { month: "Mai", open: 32, closed: 60, pending: 28 },
]

const ticketsByCategory = [
  { name: "Hardware", value: 35, color: "#3b82f6" },
  { name: "Software", value: 28, color: "#8b5cf6" },
  { name: "Rede", value: 18, color: "#ec4899" },
  { name: "Segurança", value: 15, color: "#f59e0b" },
  { name: "Outro", value: 4, color: "#6b7280" },
]

const technicianPerformance = [
  { name: "João Silva", resolved: 45, pending: 5, avg_time: "2.5h" },
  { name: "Maria Costa", resolved: 52, pending: 3, avg_time: "2.2h" },
  { name: "Pedro Oliveira", resolved: 38, pending: 8, avg_time: "3.1h" },
  { name: "Ana Santos", resolved: 41, pending: 6, avg_time: "2.8h" },
]

const urgencyDistribution = [
  { name: "Alta", value: 28, color: "#ef4444" },
  { name: "Média", value: 45, color: "#f59e0b" },
  { name: "Baixa", value: 27, color: "#10b981" },
]

const ticketStatusMetrics = [
  { label: "Abertos", value: 32, color: "bg-blue-100", icon: Clock, textColor: "text-blue-600" },
  { label: "Resolvidos", value: 245, color: "bg-green-100", icon: CheckCircle, textColor: "text-green-600" },
  { label: "Pendentes", value: 18, color: "bg-yellow-100", icon: AlertCircle, textColor: "text-yellow-600" },
  { label: "Total", value: 295, color: "bg-purple-100", icon: TrendingUp, textColor: "text-purple-600" },
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
