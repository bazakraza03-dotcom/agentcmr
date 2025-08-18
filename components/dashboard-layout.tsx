"use client"

import type React from "react"
import { InsuranceCompaniesSidebar } from "@/components/insurance-companies-sidebar"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { RightSidebar } from "@/components/right-sidebar"
import { useAuth } from "@/contexts/auth-context"
import {
  Monitor,
  FileText,
  CreditCard,
  Users,
  Car,
  RefreshCw,
  Calendar,
  AlertTriangle,
  FolderOpen,
  Upload,
  Receipt,
  BarChart3,
  Mail,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title = "AgentCMR" }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("agentcmr-right-sidebar-expanded")
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const [navSidebarExpanded, setNavSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("agentcmr-nav-sidebar-expanded")
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMainAppVisible, setIsMainAppVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    localStorage.setItem("agentcmr-right-sidebar-expanded", JSON.stringify(rightSidebarExpanded))
    console.log("[v0] Right sidebar state saved:", rightSidebarExpanded)
  }, [rightSidebarExpanded])

  useEffect(() => {
    localStorage.setItem("agentcmr-nav-sidebar-expanded", JSON.stringify(navSidebarExpanded))
    console.log("[v0] Navigation sidebar state saved:", navSidebarExpanded)
  }, [navSidebarExpanded])

  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      console.log("[v0] Tab changed:", event.detail)
      setIsMainAppVisible(event.detail.isMainApp)
    }

    const handleExpandRightSidebar = () => {
      console.log("[v0] Expanding right sidebar from minimized indicator")
      setRightSidebarExpanded(true)
    }

    window.addEventListener("agentcmr-tab-change", handleTabChange as EventListener)
    window.addEventListener("expand-right-sidebar", handleExpandRightSidebar)

    return () => {
      window.removeEventListener("agentcmr-tab-change", handleTabChange as EventListener)
      window.removeEventListener("expand-right-sidebar", handleExpandRightSidebar)
    }
  }, [])

  const toggleNavSidebar = () => {
    const newState = !navSidebarExpanded
    setNavSidebarExpanded(newState)

    const event = new CustomEvent("nav-sidebar-toggle", {
      detail: { isExpanded: newState },
    })
    window.dispatchEvent(event)
  }

  const toggleRightSidebar = () => {
    const newState = !rightSidebarExpanded
    setRightSidebarExpanded(newState)

    const event = new CustomEvent("right-sidebar-toggle", {
      detail: { isExpanded: newState },
    })
    window.dispatchEvent(event)
  }

  const navigationItems = [
    { href: "/", icon: Monitor, label: "Ekran początkowy" },
    { href: "/polisy", icon: FileText, label: "Polisy" },
    { href: "/splaty", icon: CreditCard, label: "Spłaty" },
    { href: "/klienci", icon: Users, label: "Klienci" },
    { href: "/pojazdy", icon: Car, label: "Pojazdy" },
    { href: "/wznowienia", icon: RefreshCw, label: "Wznowienia" },
    { href: "/planer", icon: Calendar, label: "Planer zadań" },
    { href: "/szkody", icon: AlertTriangle, label: "Szkody" },
    { href: "/dokumenty", icon: FolderOpen, label: "Dokumenty (repozytorium)" },
    { href: "/import", icon: Upload, label: "Import zestawień prow..." },
    { href: "/faktury", icon: Receipt, label: "Faktury" },
    { href: "/statystyki", icon: BarChart3, label: "Statystyki" },
    { href: "/komunikacja-elektroniczna", icon: Mail, label: "Komunikacja elektroniczna" },
  ]

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      <InsuranceCompaniesSidebar />

      <div
        className={`fixed left-16 top-10 ${navSidebarExpanded ? "w-64" : "w-16"} h-full bg-slate-700 text-white flex flex-col z-30 transition-all duration-300`}
      >
        <div className="p-4 bg-blue-600 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 p-2" onClick={toggleNavSidebar}>
            <Menu className="w-4 h-4" />
          </Button>
          {navSidebarExpanded && <span className="font-semibold text-lg">AgentCMR</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full ${navSidebarExpanded ? "justify-center" : "justify-center px-2"} ${
                    isActive ? "text-white hover:bg-slate-600 bg-blue-600" : "text-gray-300 hover:bg-slate-600"
                  }`}
                  title={!navSidebarExpanded ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 ${navSidebarExpanded ? "mr-2" : ""}`} />
                  {navSidebarExpanded && item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-1">
          <Link href="/ustawienia">
            <Button
              variant="ghost"
              className={`w-full ${navSidebarExpanded ? "justify-center" : "justify-center px-2"} text-gray-300 hover:bg-slate-600`}
              title={!navSidebarExpanded ? "Ustawienia" : undefined}
            >
              <Settings className={`w-4 h-4 ${navSidebarExpanded ? "mr-2" : ""}`} />
              {navSidebarExpanded && "Ustawienia"}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={`w-full ${navSidebarExpanded ? "justify-center" : "justify-center px-2"} text-white hover:bg-red-600 bg-red-500`}
            onClick={logout}
            title={!navSidebarExpanded ? "Wyloguj" : undefined}
          >
            <LogOut className={`w-4 h-4 ${navSidebarExpanded ? "mr-2" : ""}`} />
            {navSidebarExpanded && "Wyloguj"}
          </Button>
        </div>

        {navSidebarExpanded && (
          <div className="p-4 text-xs text-gray-400 border-t border-slate-600">
            <div className="space-y-1 text-center">
              <div>{new Date().toLocaleString("pl-PL")}</div>
              {user && (
                <div className="text-blue-300">
                  {user.email} ({user.role})
                  {user.serverMode === "server" ? " - Serwer" : ` - Klient (${user.serverAddress})`}
                </div>
              )}
              <div className="text-gray-500 text-xs">© 2024 Bartłomiej Mazurek</div>
            </div>
          </div>
        )}
      </div>

      {isMainAppVisible && (
        <div
          className={`fixed ${navSidebarExpanded ? "left-80" : "left-32"} top-10 ${rightSidebarExpanded ? "right-80" : "right-16"} bottom-0 flex flex-col min-w-0 z-10 transition-all duration-300`}
        >
          <header
            className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-6 py-3 flex items-center justify-between`}
          >
            <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{title}</h1>
            <UserMenu />
          </header>

          <div className="flex-1 p-6 overflow-auto">{children}</div>
        </div>
      )}

      <div className="fixed right-0 top-10 h-full z-30">
        <RightSidebar
          isExpanded={rightSidebarExpanded}
          onToggle={toggleRightSidebar}
          isDarkMode={isDarkMode}
          onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        />
      </div>
    </div>
  )
}
