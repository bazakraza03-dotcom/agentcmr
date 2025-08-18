"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth, type UserRole } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, hasPermission } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100) // Small delay to allow AuthContext to load from localStorage

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const checkAuth = () => {
      console.log("[v0] AuthGuard checking auth:", { user, isInitialized })

      if (!user) {
        console.log("[v0] No user found, redirecting to login")
        window.location.href = "/login"
        return
      }

      if (requiredRole && !hasPermission(requiredRole)) {
        console.log("[v0] Insufficient permissions")
        alert("Brak uprawnień do tej sekcji")
        return
      }

      console.log("[v0] Auth check passed, showing content")
      setIsLoading(false)
    }

    checkAuth()
  }, [user, requiredRole, hasPermission, isInitialized])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
