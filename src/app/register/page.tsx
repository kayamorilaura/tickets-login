import React, { Suspense } from "react"
import { RegisterPageClient } from "@/components/auth/RegisterPageClient"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">A carregar...</p></div>}>
      <RegisterPageClient />
    </Suspense>
  )
}
