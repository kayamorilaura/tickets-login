"use client"

import React, { useState } from "react"
import { mockUsers } from "@/lib/mockData"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Shield, Wrench, Users, Search, Mail, Building2, Pencil, Trash2, UserCog } from "lucide-react"
import { cn } from "@/lib/utils"

const roleConfig = {
  super_admin: { 
    label: "Super Admin", 
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Shield,
    description: "Acesso total ao sistema"
  },
  admin: { 
    label: "Admin", 
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Shield,
    description: "Gestão de utilizadores e configurações"
  },
  it_support: { 
    label: "IT Support", 
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Wrench,
    description: "Suporte técnico e resolução de tickets"
  },
  technician: { 
    label: "Técnico", 
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Wrench,
    description: "Intervenções no terreno"
  },
  user: { 
    label: "Utilizador", 
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: User,
    description: "Acesso standard à plataforma"
  },
}

export function UserManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | "all">("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const roleCounts = mockUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 rounded-xl">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Utilizadores Registados</h3>
            <p className="text-sm text-gray-500">
              {mockUsers.length} utilizadores no sistema
            </p>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
          <UserCog className="h-4 w-4" />
          Gerir Permissões
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedRole("all")}
          className={cn(
            "rounded-xl border p-3 text-left transition-all hover:shadow-md",
            selectedRole === "all"
              ? "border-purple-300 bg-purple-50 shadow-sm"
              : "border-gray-200 bg-white"
          )}
        >
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{mockUsers.length}</p>
        </button>
        {Object.entries(roleConfig).map(([role, config]) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all hover:shadow-md",
              selectedRole === role
                ? "border-purple-300 bg-purple-50 shadow-sm"
                : "border-gray-200 bg-white"
            )}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{config.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{roleCounts[role] || 0}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por nome, email ou empresa..."
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Utilizador
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Contacto
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Empresa
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Função
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role] || roleConfig.user
                const RoleIcon = role.icon
                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-purple-700">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        {user.company || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="group/role relative inline-block">
                        <Badge 
                          variant="outline" 
                          className={cn("gap-1.5 font-medium text-xs", role.color)}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {role.label}
                        </Badge>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/role:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {role.description}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">Nenhum utilizador encontrado</p>
            <p className="text-xs text-gray-400 mt-1">Tente ajustar os filtros de pesquisa</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {filteredUsers.length} de {mockUsers.length} utilizadores</span>
          <span>Página 1 de 1</span>
        </div>
      </div>
    </div>
  )
}