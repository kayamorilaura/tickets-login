"use client"

import React from "react"
import { mockInvites } from "@/lib/mockData"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Link2, Copy } from "lucide-react"
import { useState } from "react"

export function InviteList() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/register?invite=${token}`
    navigator.clipboard.writeText(link)
    setCopiedId(token)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Links de Convite Gerados</h3>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          {mockInvites.length} links no total
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Link
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                E-mail (ref.)
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Estado
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Criado em
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockInvites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <code className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    /register?invite={invite.code.slice(0, 8)}...
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {invite.email || "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {invite.used ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Usado
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Pendente
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {invite.createdAt.toLocaleDateString("pt-PT")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {!invite.used && (
                    <button
                      onClick={() => copyLink(invite.code)}
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {copiedId === invite.code ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copiar link
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mockInvites.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Link2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nenhum link gerado ainda.</p>
        </div>
      )}
    </div>
  )
}
