"use client"

import React, { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const urgencyOptions = ["Todas", "Alta", "Média", "Baixa"]
const dateOptions = ["Hoje", "Esta semana", "Este mês", "Personalizado"]
const categoryOptions = ["Todas", "Hardware", "Software", "Rede", "Acesso"]

const ticketTabs = ["Abertos", "Concluídos", "Passados", "Mencionados"]

export function TicketFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInMessages, setSearchInMessages] = useState(false)
  const [activeTab, setActiveTab] = useState("Abertos")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <div className="space-y-4">
      {/* Search bar + filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        <div className="flex gap-2">
          {/* Urgency Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("urgency")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Urgências
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {openDropdown === "urgency" && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("date")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Datas
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {openDropdown === "date" && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("category")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Categorias
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {openDropdown === "category" && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="search-messages"
          checked={searchInMessages}
          onCheckedChange={(checked) => setSearchInMessages(checked as boolean)}
        />
        <label htmlFor="search-messages" className="text-sm text-gray-500 cursor-pointer">
          Pesquisar dentro das mensagens dos tickets
        </label>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {ticketTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Abertos">
          <EmptyState />
        </TabsContent>
        <TabsContent value="Concluídos">
          <EmptyState />
        </TabsContent>
        <TabsContent value="Passados">
          <EmptyState />
        </TabsContent>
        <TabsContent value="Mencionados">
          <EmptyState />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg
          className="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-sm text-gray-500">Nenhum ticket encontrado</p>
    </div>
  )
}
