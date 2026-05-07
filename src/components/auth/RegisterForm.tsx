"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff, Building, User } from "lucide-react"

interface RegisterFormProps {
  inviteToken: string
  onSuccess?: () => void
}

const companies = ["Grupo Timing", "Timing IT", "Timing Solutions"]

export function RegisterForm({ inviteToken, onSuccess }: RegisterFormProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    confirmEmail: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.email !== formData.confirmEmail) {
      setError("Os e-mails não coincidem.")
      return
    }

    if (formData.password.length < 8) {
      setError("A password deve ter pelo menos 8 caracteres.")
      return
    }

    setIsLoading(true)

    const result = await register({
      fullName: formData.fullName,
      company: formData.company,
      email: formData.email,
      password: formData.password,
      inviteToken: inviteToken,
    })

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Nome Completo</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Seu nome completo"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Empresa</label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Selecione a empresa</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="nome@empresa.pt"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Confirma o teu endereço de e-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="Confirme o e-mail"
            value={formData.confirmEmail}
            onChange={(e) => updateField("confirmEmail", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="pl-10 pr-10"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? "A criar conta..." : "Criar Conta"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Este link é válido para uma única conta. Se saíres sem criar, contacta o administrador.
      </p>
    </form>
  )
}
