"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface InsuranceCompany {
  id: string
  name: string
  shortName: string
  url: string
  logo: string
  color: string
}

interface BrowserTab {
  id: string
  company: InsuranceCompany
  url: string
  title: string
  isActive: boolean
  isMainApp?: boolean
}

const mainAppTab: BrowserTab = {
  id: "agentcmr-main",
  company: {
    id: "agentcmr",
    name: "AgentCMR",
    shortName: "A",
    url: "/",
    logo: "/agentcmr-logo.png",
    color: "bg-blue-600",
  },
  url: "/",
  title: "AgentCMR",
  isActive: true,
  isMainApp: true,
}

const insuranceCompanies: InsuranceCompany[] = [
  {
    id: "warta",
    name: "Warta",
    shortName: "W",
    url: "https://agent.warta.pl",
    logo: "/images/warta-logo.png",
    color: "bg-blue-600",
  },
  {
    id: "pzu",
    name: "PZU",
    shortName: "P",
    url: "https://agent.pzu.pl",
    logo: "/images/pzu-logo.jpg",
    color: "bg-blue-600",
  },
  {
    id: "allianz",
    name: "Allianz",
    shortName: "A",
    url: "https://agent.allianz.pl",
    logo: "/allianz-logo.png",
    color: "bg-blue-800",
  },
  {
    id: "axa",
    name: "AXA",
    shortName: "X",
    url: "https://agent.axa.pl",
    logo: "/generic-geometric-logo.png",
    color: "bg-red-700",
  },
  {
    id: "generali",
    name: "Generali",
    shortName: "G",
    url: "https://agent.generali.pl",
    logo: "/images/generali-logo.jpg",
    color: "bg-red-600",
  },
  {
    id: "uniqa",
    name: "Uniqa",
    shortName: "U",
    url: "https://agent.uniqa.pl",
    logo: "/uniqa-logo.png",
    color: "bg-green-600",
  },
  {
    id: "ergo",
    name: "Ergo Hestia",
    shortName: "E",
    url: "https://agent.ergohestia.pl",
    logo: "/ergo-hestia-logo.png",
    color: "bg-purple-600",
  },
  {
    id: "compensa",
    name: "Compensa",
    shortName: "C",
    url: "https://agent.compensa.pl",
    logo: "/compensa-logo.png",
    color: "bg-indigo-600",
  },
  {
    id: "insly",
    name: "Insly",
    shortName: "I",
    url: "https://agent.insly.pl",
    logo: "/images/insly-logo.png",
    color: "bg-orange-600",
  },
  {
    id: "proama",
    name: "Proama",
    shortName: "P",
    url: "https://agent.proama.pl",
    logo: "/images/proama-logo.png",
    color: "bg-blue-500",
  },
]

export function InsuranceCompaniesSidebar() {
  const [browserTabs, setBrowserTabs] = useState<BrowserTab[]>([mainAppTab])
  const [activeTabId, setActiveTabId] = useState<string>("agentcmr-main")
  const [autoLoginConfigs, setAutoLoginConfigs] = useState<
    Record<string, { enabled: boolean; url: string; username: string; password: string }>
  >({})
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true)

  useEffect(() => {
    const handleRightSidebarToggle = (event: CustomEvent) => {
      setRightSidebarExpanded(event.detail.isExpanded)
    }

    window.addEventListener("right-sidebar-toggle", handleRightSidebarToggle as EventListener)
    return () => {
      window.removeEventListener("right-sidebar-toggle", handleRightSidebarToggle as EventListener)
    }
  }, [])

  const loadAutoLoginConfigs = () => {
    const savedAutoLogin = localStorage.getItem("agentcmr-autologin-configs")
    if (savedAutoLogin) {
      try {
        const parsed = JSON.parse(savedAutoLogin)
        setAutoLoginConfigs(parsed)
        console.log("[v0] Auto-login configs loaded:", parsed)
      } catch (error) {
        console.error("Failed to load auto-login configs:", error)
      }
    }
  }

  useEffect(() => {
    loadAutoLoginConfigs()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "agentcmr-autologin-configs") {
        console.log("[v0] Storage change detected for auto-login configs")
        loadAutoLoginConfigs()
      }
    }

    const handleConfigUpdate = () => {
      console.log("[v0] Custom event detected for auto-login config update")
      setTimeout(loadAutoLoginConfigs, 100) // Small delay to ensure localStorage is updated
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("agentcmr-autologin-updated", handleConfigUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("agentcmr-autologin-updated", handleConfigUpdate)
    }
  }, [])

  const enabledInsuranceCompanies = insuranceCompanies.filter(
    (company) => autoLoginConfigs[company.id]?.enabled === true,
  )

  useEffect(() => {
    const event = new CustomEvent("agentcmr-tab-change", {
      detail: { activeTabId, isMainApp: activeTabId === "agentcmr-main" },
    })
    window.dispatchEvent(event)
  }, [activeTabId])

  const openCompanyTab = (company: InsuranceCompany) => {
    const existingTab = browserTabs.find((tab) => tab.company.id === company.id)

    if (existingTab) {
      setActiveTabId(existingTab.id)
    } else {
      const newTab: BrowserTab = {
        id: `tab-${company.id}-${Date.now()}`,
        company,
        url: company.url,
        title: company.name,
        isActive: true,
      }

      setBrowserTabs((prev) => [...prev.map((tab) => ({ ...tab, isActive: false })), newTab])
      setActiveTabId(newTab.id)
    }
  }

  const closeTab = (tabId: string) => {
    if (tabId === "agentcmr-main") return

    setBrowserTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    if (activeTabId === tabId) {
      const remainingTabs = browserTabs.filter((tab) => tab.id !== tabId)
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : "agentcmr-main")
    }
  }

  const setActiveTab = (tabId: string) => {
    setBrowserTabs((prev) => prev.map((tab) => ({ ...tab, isActive: tab.id === tabId })))
    setActiveTabId(tabId)
  }

  const getIframeSandbox = () => {
    return "allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-downloads allow-modals"
  }

  const handleAutoLogin = (tab: BrowserTab) => {
    const config = autoLoginConfigs[tab.company.id]
    if (config && config.enabled && config.username && config.password) {
      console.log(`[v0] Auto-login attempted for ${tab.company.name}`)
      // Auto-login logic would be implemented here
      // This could involve injecting scripts or using postMessage to communicate with iframe
    }
  }

  return (
    <>
      <div className="fixed left-0 top-10 h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 w-16">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center">
            {enabledInsuranceCompanies.map((company) => (
              <div key={company.id} className="mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openCompanyTab(company)}
                  className="w-12 h-10 p-1 text-white hover:bg-slate-700 group"
                  title={company.name}
                >
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = "flex"
                      }}
                    />
                    <div
                      className={`w-full h-full rounded ${company.color} items-center justify-center text-white text-xs font-bold`}
                      style={{ display: "none" }}
                    >
                      {company.shortName}
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-16 right-0 bg-slate-100 border-b border-slate-300 z-30 h-10">
        <div className="flex items-center h-full overflow-x-auto">
          {browserTabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 h-full border-r border-slate-300 cursor-pointer min-w-0 ${
                tab.id === activeTabId ? "bg-white" : "bg-slate-200 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="w-4 h-4 rounded bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={tab.company.logo || "/placeholder.svg"}
                  alt={tab.company.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = "flex"
                  }}
                />
                <div
                  className={`w-full h-full rounded ${tab.company.color} items-center justify-center text-white text-xs font-bold`}
                  style={{ display: "none" }}
                >
                  {tab.company.shortName}
                </div>
              </div>
              <span className="text-sm truncate max-w-32">{tab.title}</span>
              {!tab.isMainApp && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="h-4 w-4 p-0 hover:bg-slate-300 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

          {!rightSidebarExpanded && (
            <div className="ml-auto flex items-center pr-2">
              <div
                className="w-8 h-6 bg-blue-100 border border-blue-300 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
                title="Narzędzia (zminimalizowane)"
                onClick={() => {
                  const event = new CustomEvent("expand-right-sidebar")
                  window.dispatchEvent(event)
                }}
              >
                <span className="text-xs text-blue-600 font-medium">N</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {browserTabs.length > 1 && (
        <div className="fixed top-10 left-16 right-0 bottom-0 z-20">
          {browserTabs.map(
            (tab) =>
              !tab.isMainApp && (
                <div key={tab.id} className={`w-full h-full ${tab.id === activeTabId ? "block" : "hidden"}`}>
                  <iframe
                    src={tab.url}
                    className="w-full h-full border-0"
                    title={tab.title}
                    sandbox={getIframeSandbox()}
                    onLoad={() => handleAutoLogin(tab)}
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              ),
          )}
        </div>
      )}
    </>
  )
}
