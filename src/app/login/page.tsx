"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockInvites, validateInvite, useInvite } from "@/lib/mockData"
import { Mail, Lock, AlertTriangle, CheckCircle, ArrowRight, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get("invite")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [company, setCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inviteStatus, setInviteStatus] = useState<"valid" | "used" | "expired" | "invalid" | null>(null)

  // Preencher email automaticamente e validar convite
  useEffect(() => {
    if (inviteToken) {
      const result = validateInvite(inviteToken)
      if (!result.valid) {
        setInviteStatus(result.message?.includes("utilizado") ? "used" : 
                        result.message?.includes("expirou") ? "expired" : "invalid")
        setError(result.message || "Convite inválido.")
      } else {
        setInviteStatus("valid")
        if (result.invite?.email) {
          setEmail(result.invite.email)
        }
      }
    }
  }, [inviteToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError("Email é obrigatório.")
      return
    }

    if (!fullName) {
      setError("Nome completo é obrigatório.")
      return
    }

    if (!password) {
      setError("Palavra-passe é obrigatória.")
      return
    }

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.")
      return
    }

    if (inviteToken) {
      const validation = validateInvite(inviteToken)
      if (!validation.valid) {
        setError(validation.message || "Convite inválido.")
        return
      }
      // Verificar se o email do formulário corresponde ao do convite
      if (validation.invite?.email && validation.invite.email.toLowerCase() !== email.toLowerCase()) {
        setError("O email não corresponde ao convite.")
        return
      }
    }

    setIsLoading(true)

    // Simular chamada API de registo
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Marcar convite como usado
    if (inviteToken) {
      useInvite(inviteToken, `user-${Date.now()}`)
    }

    setIsLoading(false)
    setSuccess(true)
  }

  // Se email veio do convite, é READ-ONLY (não editável)
  const isEmailLocked = Boolean(inviteToken && email && inviteStatus === "valid")

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
            <p className="text-gray-500 mb-6">
              Registo completado com sucesso. Redirecionando para o dashboard...
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Plataforma de Tickets</h1>
          <p className="text-gray-500 mt-1">Crie a sua conta para começar</p>
        </div>

        {/* Status do Convite */}
        {inviteToken && inviteStatus && (
          <div
            className={cn(
              "rounded-lg border px-4 py-3 text-sm flex items-center gap-2",
              inviteStatus === "valid" && "border-green-200 bg-green-50 text-green-800",
              inviteStatus === "used" && "border-red-200 bg-red-50 text-red-800",
              inviteStatus === "expired" && "border-amber-200 bg-amber-50 text-amber-800",
              inviteStatus === "invalid" && "border-red-200 bg-red-50 text-red-800"
            )}
          >
            {inviteStatus === "valid" ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {inviteStatus === "valid" && "Convite válido"}
                {inviteStatus === "used" && "Convite já utilizado"}
                {inviteStatus === "expired" && "Convite expirado"}
                {inviteStatus === "invalid" && "Convite inválido"}
              </p>
              {inviteStatus === "valid" && (
                <p className="text-xs opacity-80">
                  Email pré-preenchido do convite. Não pode ser alterado.
                </p>
              )}
            </div>
          </div>
        )}

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Registo</CardTitle>
            <CardDescription>
              {isEmailLocked
                ? "Complete o registo com os dados abaixo"
                : "Insira os seus dados para criar conta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="O teu nome completo"
                  disabled={isLoading || inviteStatus === "used" || inviteStatus === "expired" || inviteStatus === "invalid"}
                />
              </div>

              {/* Email Field - READ ONLY quando vem do convite */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email
                  {isEmailLocked && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      <Lock className="h-3 w-3 mr-1" />
                      Bloqueado
                    </Badge>
                  )}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      if (!isEmailLocked) {
                        setEmail(e.target.value)
                      }
                    }}
                    placeholder="nome@empresa.pt"
                    disabled={isEmailLocked || isLoading}
                    readOnly={isEmailLocked}
                    className={cn(
                      "transition-all",
                      isEmailLocked && "bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200"
                    )}
                  />
                  {isEmailLocked && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEmailLocked && (
                  <p className="text-xs text-gray-500">
                    Este email está associado ao seu convite e não pode ser alterado para garantir a segurança da comunicação.
                  </p>
                )}
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Empresa</label>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nome da empresa"
                  disabled={isLoading || inviteStatus === "used" || inviteStatus === "expired" || inviteStatus === "invalid"}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  Palavra-passe
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading || inviteStatus === "used" || inviteStatus === "expired" || inviteStatus === "invalid"}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  Confirmar Palavra-passe
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading || inviteStatus === "used" || inviteStatus === "expired" || inviteStatus === "invalid"}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                disabled={isLoading || inviteStatus === "used" || inviteStatus === "expired" || inviteStatus === "invalid"}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    Criar Conta
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-400">
          Ao registar-se, aceita os termos de utilização e política de privacidade.
        </p>
      </div>
    </div>
  )
}