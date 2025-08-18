"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "admin" | "agent" | "intern"

export interface User {
  email: string
  role: UserRole
  serverMode: "server" | "client"
  serverAddress: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  hasPermission: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const roleHierarchy: Record<UserRole, number> = {
  intern: 1,
  agent: 2,
  admin: 3,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored auth data
    const stored = localStorage.getItem("agent21_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        localStorage.removeItem("agent21_user")
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("agent21_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agent21_user")
    window.location.href = "/login"
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  return <AuthContext.Provider value={{ user, login, logout, hasPermission }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
