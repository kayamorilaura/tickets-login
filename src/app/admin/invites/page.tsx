"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { InviteGenerator } from "@/components/admin/InviteGenerator"
import { UserManager } from "@/components/admin/UserManager"
import { MainLayout } from "@/components/layout/MainLayout"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminInvitesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
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

  if (user?.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">Acesso Negado</h2>
          <p className="text-sm text-gray-500 mt-1">
            Apenas Super Administradores podem aceder a esta página.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gere convites e utilizadores do sistema.
          </p>
        </div>

        <InviteGenerator />

        <UserManager />
      </div>
    </MainLayout>
  )
}
