"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Ticket, AlertCircle } from "lucide-react"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { validateInvite } from "@/lib/mockData"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("invite")

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setIsValidating(false)
      setErrorMessage("Link de convite inválido. Contacta o administrador.")
      return
    }

    const result = validateInvite(token)
    setIsValid(result.valid)
    setErrorMessage(result.valid ? "" : result.message)
    setIsValidating(false)

    // Guardar no localStorage que o user viu a página de registo
    // Assim na página de login nunca mais aparece "Criar Conta"
    if (result.valid) {
      localStorage.setItem("has_seen_register", "true")
    }
  }, [token])

  const handleSuccess = () => {
    router.push("/login")
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">A validar convite...</p>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Convite Inválido</h2>
          <p className="text-sm text-gray-500 mb-4">{errorMessage}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
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
          <p className="text-sm text-gray-500 mt-1">Criar nova conta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <RegisterForm 
            inviteToken={token || ""} 
            onSuccess={handleSuccess} 
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Grupo Timing. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
