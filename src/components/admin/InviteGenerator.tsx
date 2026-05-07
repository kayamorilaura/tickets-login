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
  Trash2,
  UserX,
  Send,
  AlertTriangle,
  Link as LinkIcon,
  ShieldCheck,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function InviteGenerator() {
  const [emailImportText, setEmailImportText] = useState("")
  const [manualEmail, setManualEmail] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info")
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showMassModal, setShowMassModal] = useState(false)
  const [sendEmailAddress, setSendEmailAddress] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState<"invites" | "emails">("invites")

  const forceRefresh = () => setRefreshKey((v) => v + 1)

  const showStatus = (msg: string, type: "success" | "error" | "info" = "info") => {
    setStatusMessage(msg)
    setStatusType(type)
    setTimeout(() => setStatusMessage(null), 5000)
  }

  const filteredInvites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return mockInvites
    return mockInvites.filter(
      (invite) =>
        invite.id.toLowerCase().includes(query) ||
        invite.code.toLowerCase().includes(query) ||
        invite.email?.toLowerCase().includes(query)
    )
  }, [searchQuery, refreshKey])

  const filteredEmails = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return mockAllowedEmails
    return mockAllowedEmails.filter(
      (item) =>
        item.email.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
    )
  }, [searchQuery, refreshKey])

  const inviteStats = useMemo(() => {
    const pending = mockInvites.filter((i) => !i.used).length
    const used = mockInvites.filter((i) => i.used).length
    return { total: mockInvites.length, pending, used }
  }, [refreshKey])

  const handleImportEmails = () => {
    const emails = emailImportText
      .split(/[,;\n]+/)
      .map((v) => v.trim().toLowerCase())
      .filter((e) => e && e.includes("@"))

    if (emails.length === 0) {
      showStatus("Nenhum email válido encontrado.", "error")
      return
    }

    const added = addAllowedEmails(emails)
    setEmailImportText("")
    showStatus(
      added.length > 0
        ? `${added.length} email(s) autorizado(s). ${emails.length - added.length} já existiam.`
        : "Todos os emails já estavam autorizados.",
      added.length > 0 ? "success" : "info"
    )
    forceRefresh()
  }

  const handleAddManualEmail = () => {
    const email = manualEmail.trim().toLowerCase()
    if (!email || !email.includes("@")) {
      showStatus("Email inválido.", "error")
      return
    }
    const added = addAllowedEmails([email])
    setManualEmail("")
    showStatus(
      added.length > 0 ? `Email ${email} autorizado.` : "Email já autorizado.",
      added.length > 0 ? "success" : "info"
    )
    forceRefresh()
  }

  const handleSendSingle = () => {
    const email = sendEmailAddress.trim().toLowerCase()
    if (!email) {
      showStatus("Indica um email.", "error")
      return
    }
    if (!isEmailAuthorized(email)) {
      showStatus("Email não autorizado. Adiciona-o primeiro.", "error")
      return
    }

    const existingPending = mockInvites.find((i) => i.email === email && !i.used)
    if (existingPending) {
      showStatus(`Já existe convite pendente para ${email}. Reenviando...`, "info")
    }

    const invite = sendInviteEmail(email, "1")
    showStatus(`Link enviado para ${email}`, "success")
    setShowSendModal(false)
    setSendEmailAddress("")
    forceRefresh()
  }

  const handleMassSend = () => {
    if (mockAllowedEmails.length === 0) {
      showStatus("Nenhum email autorizado.", "error")
      return
    }

    let sent = 0
    let skipped = 0
    mockAllowedEmails.forEach((item) => {
      const existingPending = mockInvites.find((i) => i.email === item.email && !i.used)
      if (existingPending) {
        skipped++
      } else {
        sendInviteEmail(item.email, "1")
        sent++
      }
    })

    showStatus(
      `Enviados ${sent} convites. ${skipped} já tinham convite pendente.`,
      "success"
    )
    setShowMassModal(false)
    forceRefresh()
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/register?invite=${token}`
    navigator.clipboard.writeText(link)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
    showStatus("Link copiado para a área de transferência", "success")
  }

  const handleResendInvite = (email: string) => {
    const invite = sendInviteEmail(email, "1")
    showStatus(`Link reenviado para ${email}`, "success")
    forceRefresh()
  }

  const handleRegenerateInvite = (email: string) => {
    // Invalidar convite anterior marcando como usado
    const existing = mockInvites.find((i) => i.email === email)
    if (existing) {
      existing.used = true
      existing.usedAt = new Date()
    }
    const invite = createInvite(email, "1")
    showStatus(`Novo link gerado para ${email}`, "success")
    forceRefresh()
  }

  // NOTA: deleteInvite e revokeAllowedEmail não existem no mockData original
  // Comentado para evitar erros de importação
  /*
  const handleDeleteInvite = (id: string) => {
    // deleteInvite(id) // necessário adicionar ao mockData
    showStatus("Convite eliminado.", "success")
    forceRefresh()
  }

  const handleRevokeEmail = (id: string, email: string) => {
    // revokeAllowedEmail(id) // necessário adicionar ao mockData
    showStatus(`Email ${email} removido da lista autorizada.`, "success")
    forceRefresh()
  }
  */

  const getStatusBadge = (invite: typeof mockInvites[0]) => {
    if (invite.used) {
      return (
        <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100 border-0">
          <Check className="h-3 w-3" />
          Utilizado
        </Badge>
      )
    }
    // Verificar expiração (7 dias)
    const now = new Date()
    const diffDays = (now.getTime() - invite.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays > 7) {
      return (
        <Badge className="gap-1 bg-red-100 text-red-700 hover:bg-red-100 border-0">
          <AlertTriangle className="h-3 w-3" />
          Expirado
        </Badge>
      )
    }
    return (
      <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
        <Clock className="h-3 w-3" />
        Pendente
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestor de Acessos</h3>
              <p className="text-sm text-gray-500">
                Controle quem pode aceder à plataforma de tickets
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowSendModal(true)}>
            <Send className="h-4 w-4" />
            Enviar Convite
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => setShowMassModal(true)}>
            <MailCheck className="h-4 w-4" />
            Envio em Massa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-purple-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Autorizados</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAllowedEmails.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Links</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inviteStats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inviteStats.pending}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Utilizados</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inviteStats.used}</p>
        </div>
      </div>

      {/* Import Section */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MailPlus className="h-4 w-4 text-purple-600" />
          <h4 className="text-sm font-semibold text-gray-900">Importar Emails Autorizados</h4>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Cole uma lista de emails (separados por vírgula, ponto-e-vírgula ou nova linha) ou adicione manualmente.
        </p>
        <textarea
          value={emailImportText}
          onChange={(e) => setEmailImportText(e.target.value)}
          placeholder="exemplo@empresa.pt&#10;outro@empresa.pt&#10;mais.um@empresa.pt"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all resize-y min-h-[80px]"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Button onClick={handleImportEmails} className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            Importar Lista
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              type="email"
              placeholder="Ou adicionar email manual..."
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddManualEmail()}
              className="flex-1"
            />
            <Button onClick={handleAddManualEmail} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab("invites")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              activeTab === "invites"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Convites ({mockInvites.length})
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              activeTab === "emails"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Emails Autorizados ({mockAllowedEmails.length})
          </button>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de Convites */}
      {activeTab === "invites" && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Link</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Criado em</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Utilizado em</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {invite.code.slice(0, 12)}...
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-medium">{invite.email || "—"}</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(invite)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {invite.createdAt.toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {invite.usedAt ? invite.usedAt.toLocaleDateString("pt-PT") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyLink(invite.code)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Copiar link"
                        >
                          {copiedToken === invite.code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        {!invite.used && (
                          <button
                            onClick={() => invite.email && handleResendInvite(invite.email)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Reenviar"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                        )}
                        {invite.used && (
                          <button
                            onClick={() => invite.email && handleRegenerateInvite(invite.email)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Gerar novo link"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvites.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Nenhum convite encontrado</p>
              <p className="text-xs text-gray-400 mt-1">Crie um convite para começar</p>
            </div>
          )}
        </div>
      )}

      {/* Tabela de Emails Autorizados */}
      {activeTab === "emails" && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Origem</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Adicionado em</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Convite</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmails.map((item) => {
                  const hasInvite = mockInvites.some((i) => i.email === item.email)
                  const pendingInvite = mockInvites.find((i) => i.email === item.email && !i.used)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.importedFrom}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.createdAt.toLocaleDateString("pt-PT")}
                      </td>
                      <td className="px-4 py-3">
                        {pendingInvite ? (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Pendente</Badge>
                        ) : hasInvite ? (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">Utilizado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Sem convite</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!pendingInvite && (
                            <button
                              onClick={() => {
                                sendInviteEmail(item.email, "1")
                                showStatus(`Convite enviado para ${item.email}`, "success")
                                forceRefresh()
                              }}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Enviar convite"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredEmails.length === 0 && (
            <div className="px-6 py-12 text-center">
              <ShieldCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Nenhum email autorizado</p>
              <p className="text-xs text-gray-400 mt-1">Adicione emails para permitir o registo</p>
            </div>
          )}
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2",
            statusType === "success" && "border-green-200 bg-green-50 text-green-800",
            statusType === "error" && "border-red-200 bg-red-50 text-red-800",
            statusType === "info" && "border-purple-200 bg-purple-50 text-purple-800"
          )}
        >
          {statusType === "success" && <Check className="h-4 w-4" />}
          {statusType === "error" && <AlertTriangle className="h-4 w-4" />}
          {statusType === "info" && <Mail className="h-4 w-4" />}
          {statusMessage}
        </div>
      )}

      {/* Modal: Enviar Convite */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enviar Convite</h2>
                <p className="text-sm text-gray-500">Enviar link de registo para um email autorizado</p>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email de destino</label>
                <Input
                  type="email"
                  placeholder="nome@empresa.pt"
                  value={sendEmailAddress}
                  onChange={(e) => setSendEmailAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendSingle()}
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                O link será gerado automaticamente e associado a este email. 
                Na página de registo, o email virá pré-preenchido e não poderá ser alterado.
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendSingle} className="bg-purple-600 hover:bg-purple-700 gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Convite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Envio em Massa */}
      {showMassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Envio em Massa</h2>
                <p className="text-sm text-gray-500">Enviar convites para todos os emails autorizados</p>
              </div>
              <button
                onClick={() => setShowMassModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MailCheck className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Resumo do Envio</span>
                </div>
                <div className="space-y-1 text-sm text-purple-800">
                  <p>Total de emails autorizados: <strong>{mockAllowedEmails.length}</strong></p>
                  <p>Emails com convite pendente: <strong>{mockInvites.filter(i => !i.used).length}</strong></p>
                  <p className="text-xs text-purple-600 mt-2">
                    Emails que já têm convite pendente não receberão novo link.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMassModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleMassSend} className="bg-purple-600 hover:bg-purple-700 gap-2">
                  <MailCheck className="h-4 w-4" />
                  Confirmar Envio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}