"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Ticket } from "lucide-react"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
            <Ticket className="h-7 w-7 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Tickets IT</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema de gestão de tickets</p>
        </div>

        {/* Card - Só Login */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Login</h2>
          <LoginForm onSuccess={handleSuccess} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Grupo Timing. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
