"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { LogOut, AlertCircle } from "lucide-react"

export default function OffboardingPage() {
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
          <LogOut className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Offboarding</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Em desenvolvimento</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            A página de Offboarding está a ser implementada. 
            Em breve poderás gerir as saídas de colaboradores.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
