"use client"

import React, { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  mockAllowedEmails,
  mockInvites,
  addAllowedEmails,
  createInvite,
  sendInviteEmail,
  isEmailAuthorized,
} from "@/lib/mockData"
import {
  Search,
  Mail,
  MailPlus,
  MailCheck,
  Copy,
  Check,
  RefreshCcw,
  Plus,
  Clock,
} from "lucide-react"

export function InviteGenerator() {
  const [emailImportText, setEmailImportText] = useState("")
  const [manualEmail, setManualEmail] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showMassModal, setShowMassModal] = useState(false)
  const [sendEmailAddress, setSendEmailAddress] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const forceRefresh = () => setRefreshKey((value) => value + 1)

  const filteredInvites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return mockInvites
    }
    return mockInvites.filter((invite) => {
      return (
        invite.id.toLowerCase().includes(query) ||
        invite.code.toLowerCase().includes(query) ||
        invite.email?.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, refreshKey])

  const inviteStats = useMemo(() => {
    const pending = mockInvites.filter((invite) => !invite.used).length
    const used = mockInvites.filter((invite) => invite.used).length
    return { total: mockInvites.length, pending, used }
  }, [refreshKey])

  const handleImportEmails = () => {
    const emails = emailImportText
      .split(/[,;\n]+/)
      .map((value) => value.trim().toLowerCase())
      .filter((email) => email)

    const added = addAllowedEmails(emails)
    setEmailImportText("")
    setStatusMessage(
      added.length > 0
        ? `Foram autorizados ${added.length} e-mails.`
        : "Nenhum e-mail novo adicionado."
    )
    forceRefresh()
  }

  const handleAddManualEmail = () => {
    const email = manualEmail.trim().toLowerCase()
    if (!email) {
      setStatusMessage("Indica um e-mail para adicionar.")
      return
    }
    if (!email.includes("@")) {
      setStatusMessage("E-mail inválido.")
      return
    }
    const added = addAllowedEmails([email])
    setManualEmail("")
    setStatusMessage(
      added.length > 0 ? `E-mail ${email} adicionado.` : "Este e-mail já estava autorizado."
    )
    forceRefresh()
  }

  const handleSendSingle = () => {
    const email = sendEmailAddress.trim().toLowerCase()
    if (!email) {
      setStatusMessage("Indica um e-mail para enviar.")
      return
    }

    if (!isEmailAuthorized(email)) {
      setStatusMessage("E-mail não autorizado. Importa ou adiciona-o primeiro.")
      return
    }

    const invite = sendInviteEmail(email, "1")
    setStatusMessage(`Link enviado para ${email}: /register?invite=${invite.code}`)
    setShowSendModal(false)
    setSendEmailAddress("")
    forceRefresh()
  }

  const handleMassSend = () => {
    if (mockAllowedEmails.length === 0) {
      setStatusMessage("Nenhum e-mail autorizado para enviar em massa.")
      return
    }

    mockAllowedEmails.forEach((item) => {
      sendInviteEmail(item.email, "1")
    })

    setStatusMessage(`Foram enviados links para ${mockAllowedEmails.length} e-mails autorizados.`)
    setShowMassModal(false)
    forceRefresh()
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/register?invite=${token}`
    navigator.clipboard.writeText(link)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handleResendInvite = (email: string) => {
    const invite = sendInviteEmail(email, "1")
    setStatusMessage(`Link reenviado para ${email}: /register?invite=${invite.code}`)
    forceRefresh()
  }

  const handleRegenerateInvite = (email: string) => {
    const invite = createInvite(email, "1")
    setStatusMessage(`Novo link gerado para ${email}: /register?invite=${invite.code}`)
    forceRefresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Gestor de Convites e E-mails Autorizados</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Gere a lista de e-mails autorizados, envie convites por e-mail e reenvie links individuais.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2" onClick={() => setShowSendModal(true)}>
            <MailPlus className="h-4 w-4" />
            Enviar e-mail
          </Button>
          <Button className="gap-2" onClick={() => setShowMassModal(true)}>
            <MailCheck className="h-4 w-4" />
            Enviar e-mail em massa
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">Importar e-mails autorizados</p>
            <p className="text-sm text-gray-500 mb-3">
              Cole a lista de e-mails do 365 ou adicione manualmente apenas os endereços que podem receber convites.
            </p>
            <textarea
              value={emailImportText}
              onChange={(event) => setEmailImportText(event.target.value)}
              placeholder="nome@empresa.pt\noutro@empresa.pt"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none"
              rows={4}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button onClick={handleImportEmails} className="gap-2">
                <Plus className="h-4 w-4" />
                Importar e-mails
              </Button>
              <div className="flex-1 min-w-0">
                <Input
                  type="email"
                  placeholder="Adicionar e-mail manualmente"
                  value={manualEmail}
                  onChange={(event) => setManualEmail(event.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleAddManualEmail} variant="outline" className="gap-2">
                Adicionar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">E-mails autorizados</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{mockAllowedEmails.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Convites pendentes</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{inviteStats.pending}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Convites usados</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{inviteStats.used}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-sm font-semibold text-gray-800">Busca e filtros rápidos</p>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Pesquisar convites por e-mail ou código"
              className="pl-10"
            />
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Link</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3">Utilizado em</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <code className="rounded bg-gray-50 px-2 py-1">{invite.code.slice(0, 8)}...</code>
                    </td>
                    <td className="px-4 py-3">{invite.email || "—"}</td>
                    <td className="px-4 py-3">
                      {invite.used ? (
                        <Badge variant="destructive" className="gap-1">
                          <RefreshCcw className="h-3 w-3" />
                          Usado
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pendente
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{invite.createdAt.toLocaleDateString("pt-PT")}</td>
                    <td className="px-4 py-3">{invite.usedAt ? invite.usedAt.toLocaleDateString("pt-PT") : "—"}</td>
                    <td className="px-4 py-3 space-y-2">
                      <button
                        onClick={() => copyLink(invite.code)}
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        {copiedToken === invite.code ? (
                          <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Copiado</span>
                        ) : (
                          <span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" /> Copiar</span>
                        )}
                      </button>
                      {!invite.used ? (
                        <button
                          onClick={() => invite.email && handleResendInvite(invite.email)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Reenviar link
                        </button>
                      ) : (
                        <button
                          onClick={() => invite.email && handleRegenerateInvite(invite.email)}
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          Gerar novo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInvites.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">Nenhum convite encontrado.</div>
            )}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-900">
          {statusMessage}
        </div>
      )}

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enviar convite por e-mail</h2>
                <p className="text-sm text-gray-500">Insira o e-mail autorizado para enviar um link.</p>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <Input
                type="email"
                placeholder="nome@empresa.pt"
                value={sendEmailAddress}
                onChange={(event) => setSendEmailAddress(event.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendSingle}>Enviar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enviar convite em massa</h2>
                <p className="text-sm text-gray-500">Os links serão enviados a todos os e-mails autorizados no sistema.</p>
              </div>
              <button
                onClick={() => setShowMassModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                Total de e-mails autorizados: <strong>{mockAllowedEmails.length}</strong>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMassModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleMassSend}>Confirmar envio</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
