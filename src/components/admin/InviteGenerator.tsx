"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createInvite } from "@/lib/mockData"
import { Plus, Copy, Check, Link2 } from "lucide-react"

export function InviteGenerator() {
  const [email, setEmail] = useState("")
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const invite = createInvite(email || undefined, "super-admin-1")
    const link = `${window.location.origin}/register?invite=${invite.code}`
    setGeneratedLink(link)
    setCopied(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Gerar Novo Link de Convite</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            E-mail do convidado (opcional, para referência)
          </label>
          <Input
            type="email"
            placeholder="nome@empresa.pt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          onClick={handleGenerate}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Gerar Link
        </Button>
      </div>

      {generatedLink && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
              Link de registo (único)
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-white border border-purple-200 rounded px-3 py-2 text-purple-900 truncate">
                {generatedLink}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generatedLink)}
                className="border-purple-200 text-purple-700 hover:bg-purple-100 flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <p className="text-xs font-medium text-gray-700 mb-1">Como usar:</p>
            <ol className="text-xs text-gray-500 list-decimal list-inside space-y-1">
              <li>Copia o link acima</li>
              <li>Envia por email/Teams/Slack ao funcionário</li>
              <li>O funcionário clica e cria a conta</li>
              <li>Depois de usado, o link fica inválido</li>
            </ol>
          </div>

          <p className="text-xs text-purple-500">
            ⚠️ Este link só funciona uma vez. Depois de criar conta, expira automaticamente.
          </p>
        </div>
      )}
    </div>
  )
}
