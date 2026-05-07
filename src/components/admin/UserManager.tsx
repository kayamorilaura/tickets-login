"use client"

import React from "react"
import { mockUsers } from "@/lib/mockData"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Wrench, Users } from "lucide-react"

const roleConfig = {
  super_admin: { label: "Super Admin", color: "purple", icon: <Shield className="h-3 w-3" /> },
  admin: { label: "Admin", color: "blue", icon: <Shield className="h-3 w-3" /> },
  it_support: { label: "IT Support", color: "orange", icon: <Wrench className="h-3 w-3" /> },
  technician: { label: "Técnico", color: "green", icon: <Wrench className="h-3 w-3" /> },
  user: { label: "Utilizador", color: "gray", icon: <User className="h-3 w-3" /> },
}

export function UserManager() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Utilizadores Registados</h3>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          {mockUsers.length} utilizadores no sistema
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Nome
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                E-mail
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Empresa
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Função
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockUsers.map((user) => {
              const role = roleConfig[user.role] || roleConfig.user
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-purple-700">
                          {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.company}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={role.color as any} className="gap-1">
                      {role.icon}
                      {role.label}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {mockUsers.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nenhum utilizador registado.</p>
        </div>
      )}
    </div>
  )
}
