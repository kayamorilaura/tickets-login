"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { validateInvite } from "@/lib/mockData"
import { KeyRound, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InviteCodeInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
}

export function InviteCodeInput({ value, onChange }: InviteCodeInputProps) {
  const [status, setStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle")
  const [message, setMessage] = useState("")

  const handleChange = (newValue: string) => {
    onChange(newValue, status === "valid")

    if (newValue.length === 0) {
      setStatus("idle")
      setMessage("")
      return
    }

    if (newValue.length >= 10) {
      setStatus("checking")
      // Simular pequeno delay de validação
      setTimeout(() => {
        const result = validateInvite(newValue)
        if (result.valid) {
          setStatus("valid")
          setMessage(result.message)
          onChange(newValue, true)
        } else {
          setStatus("invalid")
          setMessage(result.message)
          onChange(newValue, false)
        }
      }, 300)
    } else {
      setStatus("idle")
      setMessage("")
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        Código de Convite <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="GT-2026-XXXX"
          value={value}
          onChange={(e) => handleChange(e.target.value.toUpperCase())}
          className={cn(
            "pl-10 uppercase tracking-wider",
            status === "valid" && "border-green-500 focus-visible:ring-green-500",
            status === "invalid" && "border-red-500 focus-visible:ring-red-500"
          )}
          required
        />
        {status === "valid" && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
        {status === "invalid" && (
          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
        )}
      </div>
      {message && (
        <p className={cn(
          "text-xs",
          status === "valid" ? "text-green-600" : "text-red-600"
        )}>
          {message}
        </p>
      )}
      <p className="text-xs text-gray-400">
        Código de convite fornecido pelo administrador. Códigos de teste: GT-2026-X7K9
      </p>
    </div>
  )
}
