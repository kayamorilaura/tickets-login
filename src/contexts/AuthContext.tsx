"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User, AuthState } from "@/types"
import { mockLogin, mockRegister } from "@/lib/mockData"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (data: {
    fullName: string
    company: string
    email: string
    password: string
    inviteToken: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("tickets_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        localStorage.removeItem("tickets_user")
        setState({ user: null, isAuthenticated: false, isLoading: false })
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = mockLogin(email, password)

    if (result.success && result.user) {
      localStorage.setItem("tickets_user", JSON.stringify(result.user))
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
    }

    return { success: result.success, message: result.message }
  }

  const register = async (data: {
    fullName: string
    company: string
    email: string
    password: string
    inviteToken: string
  }) => {
    const result = mockRegister(data)

    if (result.success && result.user) {
      localStorage.setItem("tickets_user", JSON.stringify(result.user))
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
    }

    return { success: result.success, message: result.message }
  }

  const logout = () => {
    localStorage.removeItem("tickets_user")
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
