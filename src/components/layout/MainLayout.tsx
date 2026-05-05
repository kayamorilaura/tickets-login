"use client"

import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          "lg:ml-[260px]"
        )}
      >
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
