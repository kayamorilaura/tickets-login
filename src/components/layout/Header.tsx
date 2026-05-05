"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Menu, LogOut, Clock, Ticket } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useCurrentTime } from "@/hooks/useCurrentTime"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const currentTime = useCurrentTime()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??"

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">Tickets IT</span>
              <span className="text-xs text-gray-400 leading-tight">Grupo Timing</span>
            </div>
          </div>
        </div>

        {/* Center: Clock */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600 tabular-nums">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Right: User + Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-purple-700">{initials}</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.name || "Utilizador"}
                </span>
                <span className="text-xs text-gray-400 leading-tight capitalize">
                  {user?.role?.replace("_", " ") || "User"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
