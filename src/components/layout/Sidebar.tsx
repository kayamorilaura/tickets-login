"use client"

import React, { useState } from "react"
import {
  BarChart3,
  RefreshCw,
  Zap,
  UserPlus,
  Shuffle,
  Calendar,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Shield,
  Ticket,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  adminOnly?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "MONITORIZAÇÃO",
    items: [
      { label: "Estatísticas", icon: <BarChart3 className="h-4 w-4" />, href: "/estatisticas" },
      { label: "Relatório Reatribuições", icon: <RefreshCw className="h-4 w-4" />, href: "/relatorio" },
    ],
  },
  {
    title: "ASSISTÊNCIA",
    items: [
      { label: "Pedidos Rápidos", icon: <Zap className="h-4 w-4" />, href: "/quick-requests", active: true },
      { label: "Tickets", icon: <Ticket className="h-4 w-4" />, href: "/tickets" },
    ],
  },
  {
    title: "PESSOAS",
    items: [
      { label: "Onboardings", icon: <UserPlus className="h-4 w-4" />, href: "/onboardings" },
      { label: "Offboarding", icon: <LogOut className="h-4 w-4" />, href: "/offboarding" },
      { label: "Alterações de Funções", icon: <Shuffle className="h-4 w-4" />, href: "/alteracoes" },
      { label: "Férias", icon: <Calendar className="h-4 w-4" />, href: "/ferias" },
    ],
  },
  {
    title: "SUPORTE",
    items: [
      { label: "Ajuda", icon: <HelpCircle className="h-4 w-4" />, href: "/ajuda" },
    ],
  },
]

const adminSection: MenuSection = {
  title: "ADMINISTRAÇÃO",
  items: [
    {
      label: "Convites",
      icon: <KeyRound className="h-4 w-4" />,
      href: "/admin/invites",
      adminOnly: true,
    },
  ],
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { user } = useAuth()
  const isSuperAdmin = user?.role === "super_admin"

  return (
    <React.Fragment>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-[#F8F9FA] border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "w-[260px]" : "w-0 lg:w-[260px]"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-3 pb-4">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className={cn(sectionIndex > 0 && "mt-6")}>
                <h3 className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          item.active
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <span className="text-gray-400">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {sectionIndex < menuSections.length - 1 && (
                  <div className="mt-4 mx-3 border-t border-gray-200" />
                )}
              </div>
            ))}

            {isSuperAdmin && (
              <div className="mt-6">
                <div className="mt-4 mx-3 border-t border-gray-200 mb-4" />
                <h3 className="px-3 mb-2 text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  {adminSection.title}
                </h3>
                <ul className="space-y-0.5">
                  {adminSection.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <span className="text-purple-400">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-all lg:hidden",
          isOpen && "left-[270px]"
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </React.Fragment>
  )
}
