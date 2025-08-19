"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Settings,
  Users,
  Shield,
  Monitor,
  Palette,
  Database,
  Network,
  Key,
  Download,
  Upload,
  Wifi,
  Mail,
  MessageSquare,
  Lock,
  Building2,
  Car,
  Home,
  Briefcase,
  Globe,
  Bell,
  Chrome,
  Folder,
  UserIcon,
} from "lucide-react"

interface UserType {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "intern"
  isActive: boolean
  lastLogin: string
}

const mockUsers: UserType[] = [
  {
    id: "1",
    name: "MichaĹ‚ JasiĹ„ski",
    email: "michal@agentcmr.pl",
    role: "admin",
    isActive: true,
    lastLogin: "2024-01-15 14:30",
  },
  {
    id: "2",
    name: "Anna Kowalska",
    email: "anna@agentcmr.pl",
    role: "agent",
    isActive: true,
    lastLogin: "2024-01-15 12:15",
  },
  {
    id: "3",
    name: "Piotr Nowak",
    email: "piotr@agentcmr.pl",
    role: "intern",
    isActive: false,
    lastLogin: "2024-01-10 09:45",
  },
]

const insuranceCompanies = [
  { id: "warta", name: "Warta", icon: Building2, url: "https://eagent.warta.pl/" },
  { id: "generallagro", name: "GeneraliAgro", icon: Globe, url: "https://portal.generallagro.pl/" },
  { id: "generali", name: "Generali", icon: Briefcase, url: "https://portal.generali.pl/" },
  { id: "generali-raporty", name: "Generali Raporty Prowizje", icon: Briefcase, url: "https://portal.generali.pl/" },
  { id: "proama", name: "Proama", icon: Shield, url: "https://portal.proama.pl/" },
  { id: "vh-polska", name: "VH Polska", icon: Home, url: "https://mojc.verechnicze-hagel.pl/" },
  { id: "ergohestia", name: "ErgoHestia", icon: Car, url: "https://ssor.ergohestia.pl" },
  { id: "ergoagro", name: "ErgoAgro", icon: Car, url: "https://evs.ergohestia.pl/" },
  { id: "insly", name: "INSLY", icon: Globe, url: "https://portal.insly.pl/" },
  { id: "interrisk", name: "Interrisk", icon: Shield, url: "https://portal.interrisk.pl/" },
  {
    id: "agroubezpieczenia",
    name: "AgroUbezpieczenia (Pocztowy)",
    icon: Home,
    url: "https://portal.agroubezpieczenia.pl",
  },
  { id: "wiener", name: "Wiener", icon: Building2, url: "https://wiener.pl/" },
  { id: "uniqa", name: "Uniqa", icon: Globe, url: "https://pos.uniqa.pl" },
  { id: "compensa", name: "Compensa", icon: Shield, url: "https://cportal.compensa.pl" },
  { id: "link4", name: "Link4", icon: Car, url: "https://www.link4.pl/kalkulatory" },
  { id: "tuz", name: "TUZ", icon: Building2, url: "https://sobol-beta.tuz.pl/" },
  { id: "wefox", name: "Wefox", icon: Globe, url: "https://system.unext.pl" },
  { id: "pzu", name: "PZU", icon: Shield, url: "https://everest.pzu.pl" },
  { id: "allianz", name: "Allianz", icon: Briefcase, url: "https://tuz.allianz.pl" },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState(mockUsers)
  const [darkMode, setDarkMode] = useState(false)
  const [serverMode, setServerMode] = useState("client")
  const [autoBackup, setAutoBackup] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [licenseEnabled, setLicenseEnabled] = useState(false)

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "intern" as "admin" | "agent" | "intern",
    password: "",
  })

  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, boolean>>>({})

  const modulePermissions = {
    dashboard: { view: "PodglÄ…d dashboardu", edit: "Edycja dashboardu" },
    clients: {
      view: "PodglÄ…d klientĂłw",
      create: "Dodawanie klientĂłw",
      edit: "Edycja klientĂłw",
      delete: "Usuwanie klientĂłw",
    },
    policies: {
      view: "PodglÄ…d polis",
      create: "Tworzenie polis",
      edit: "Edycja polis",
      delete: "Usuwanie polis",
      import: "Import polis",
    },
    vehicles: {
      view: "PodglÄ…d pojazdĂłw",
      create: "Dodawanie pojazdĂłw",
      edit: "Edycja pojazdĂłw",
      delete: "Usuwanie pojazdĂłw",
    },
    payments: {
      view: "PodglÄ…d pĹ‚atnoĹ›ci",
      create: "Dodawanie pĹ‚atnoĹ›ci",
      edit: "Edycja pĹ‚atnoĹ›ci",
      delete: "Usuwanie pĹ‚atnoĹ›ci",
    },
    renewals: {
      view: "PodglÄ…d wznowieĹ„",
      create: "Tworzenie wznowieĹ„",
      edit: "Edycja wznowieĹ„",
      process: "Przetwarzanie wznowieĹ„",
    },
    tasks: {
      view: "PodglÄ…d zadaĹ„",
      create: "Tworzenie zadaĹ„",
      edit: "Edycja zadaĹ„",
      delete: "Usuwanie zadaĹ„",
      assign: "Przypisywanie zadaĹ„",
    },
    reports: {
      view: "PodglÄ…d raportĂłw",
      create: "Tworzenie raportĂłw",
      export: "Eksport raportĂłw",
      advanced: "Zaawansowane raporty",
    },
    communication: { view: "PodglÄ…d komunikacji", send: "WysyĹ‚anie wiadomoĹ›ci", templates: "ZarzÄ…dzanie szablonami" },
    settings: {
      view: "PodglÄ…d ustawieĹ„",
      edit: "Edycja ustawieĹ„",
      users: "ZarzÄ…dzanie uĹĽytkownikami",
      system: "Ustawienia systemowe",
    },
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Wszystkie pola sÄ… wymagane")
      return
    }

    const user: UserType = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: true,
      lastLogin: "Nigdy",
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "intern", password: "" })
    setShowAddUserModal(false)
  }

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      setUserToDelete(null)
      setShowDeleteUserModal(false)
    }
  }

  const handlePermissionChange = (userId: string, module: string, permission: string, value: boolean) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [`${module}.${permission}`]: value,
      },
    }))
  }

  const [autoLoginConfigs, setAutoLoginConfigs] = useState(
    insuranceCompanies.reduce(
      (acc, company) => {
        acc[company.id] = {
          enabled: false,
          url: company.url,
          username: "",
          password: "",
        }
        return acc
      },
      {} as Record<string, { enabled: boolean; url: string; username: string; password: string }>,
    ),
  )

  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(false)
  const [smsGatewayUrl, setSmsGatewayUrl] = useState("")
  const [smsGatewayApiKey, setSmsGatewayApiKey] = useState("")
  const [emailGatewayEnabled, setEmailGatewayEnabled] = useState(false)
  const [emailSmtpServer, setEmailSmtpServer] = useState("")
  const [emailSmtpPort, setEmailSmtpPort] = useState("587")
  const [emailUsername, setEmailUsername] = useState("")
  const [emailPassword, setEmailPassword] = useState("")

  const [desktopFeatures, setDesktopFeatures] = useState({
    autoStart: true,
    minimizeToTray: true,
    builtInBrowser: true,
    soundNotifications: true,
    systemTrayIcon: true,
    startMinimized: false,
    closeToTray: true,
    autoUpdate: true,
    windowPosition: "remember",
    defaultBrowserPath: "",
    workingDirectory: "C:\\AgentCMR\\Data",
    logLevel: "info",
    maxLogFiles: 10,
    enableHotkeys: true,
    hotkeyNewClient: "Ctrl+N",
    hotkeySearch: "Ctrl+F",
    hotkeyTaskPlanner: "Ctrl+T",
  })

  useEffect(() => {
    const savedAutoLogin = localStorage.getItem("agentcmr-autologin-configs")
    if (savedAutoLogin) {
      try {
        const parsed = JSON.parse(savedAutoLogin)
        setAutoLoginConfigs(parsed)
      } catch (error) {
        console.error("Failed to load auto-login configs:", error)
      }
    }

    const savedDarkMode = localStorage.getItem("agentcmr-dark-mode")
    if (savedDarkMode) {
      const isDark = savedDarkMode === "true"
      setDarkMode(isDark)
      applyDarkMode(isDark)
    }

    const savedSettings = localStorage.getItem("agentcmr-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setServerMode(parsed.serverMode || "client")
        setAutoBackup(parsed.autoBackup !== undefined ? parsed.autoBackup : true)
        setNotifications(parsed.notifications !== undefined ? parsed.notifications : true)
        setSmsGatewayEnabled(parsed.smsGatewayEnabled || false)
        setSmsGatewayUrl(parsed.smsGatewayUrl || "")
        setSmsGatewayApiKey(parsed.smsGatewayApiKey || "")
        setEmailGatewayEnabled(parsed.emailGatewayEnabled || false)
        setEmailSmtpServer(parsed.emailSmtpServer || "")
        setEmailSmtpPort(parsed.emailSmtpPort || "587")
        setEmailUsername(parsed.emailUsername || "")
        setEmailPassword(parsed.emailPassword || "")
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    const savedDesktopFeatures = localStorage.getItem("agentcmr-desktop-features")
    if (savedDesktopFeatures) {
      try {
        const parsed = JSON.parse(savedDesktopFeatures)
        setDesktopFeatures((prev) => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Failed to load desktop features:", error)
      }
    }
  }, [])

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const saveAutoLoginConfigs = () => {
    try {
      localStorage.setItem("agentcmr-autologin-configs", JSON.stringify(autoLoginConfigs))
      console.log("Auto-login configurations saved successfully")
    } catch (error) {
      console.error("Failed to save auto-login configs:", error)
    }
  }

  const saveSettings = () => {
    try {
      const settings = {
        serverMode,
        autoBackup,
        notifications,
        smsGatewayEnabled,
        smsGatewayUrl,
        smsGatewayApiKey,
        emailGatewayEnabled,
        emailSmtpServer,
        emailSmtpPort,
        emailUsername,
        emailPassword,
      }
      localStorage.setItem("agentcmr-settings", JSON.stringify(settings))
      console.log("Settings saved successfully")
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const handleRoleChange = (userId: string, newRole: "admin" | "agent" | "intern") => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  const handleUserToggle = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)))
  }

  const handleAutoLoginChange = (companyId: string, field: string, value: string | boolean) => {
    setAutoLoginConfigs((prev) => {
      const updated = {
        ...prev,
        [companyId]: {
          ...prev[companyId],
          [field]: value,
        },
      }
      localStorage.setItem("agentcmr-autologin-configs", JSON.stringify(updated))

      const event = new CustomEvent("agentcmr-autologin-updated")
      window.dispatchEvent(event)

      console.log("[v0] Auto-login config updated:", { companyId, field, value })
      return updated
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "agent":
        return "default"
      case "intern":
        return "secondary"
      default:
        return "outline"
    }
  }

  const isAdmin = user?.role === "admin"

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
    applyDarkMode(checked)
    localStorage.setItem("agentcmr-dark-mode", checked.toString())
  }

  const saveDesktopFeatures = () => {
    try {
      localStorage.setItem("agentcmr-desktop-features", JSON.stringify(desktopFeatures))
      console.log("Desktop features saved successfully")
    } catch (error) {
      console.error("Failed to save desktop features:", error)
    }
  }

  const handleDesktopFeatureChange = (key: string, value: any) => {
    setDesktopFeatures((prev) => {
      const updated = { ...prev, [key]: value }
      setTimeout(() => {
        localStorage.setItem("agentcmr-desktop-features", JSON.stringify(updated))
      }, 500)
      return updated
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Ustawienia systemu</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="general">OgĂłlne</TabsTrigger>
            <TabsTrigger value="users" disabled={!isAdmin}>
              UĹĽytkownicy
            </TabsTrigger>
            <TabsTrigger value="autologin">Auto-login</TabsTrigger>
            <TabsTrigger value="communication">Komunikacja</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="network">SieÄ‡ LAN</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="license">Licencja</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  WyglÄ…d i interfejs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Tryb ciemny</Label>
                    <p className="text-sm text-muted-foreground">PrzeĹ‚Ä…cz na ciemny motyw interfejsu</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeChange} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Powiadomienia</Label>
                    <p className="text-sm text-muted-foreground">WyĹ›wietlaj powiadomienia systemowe</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Ustawienia aplikacji
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">JÄ™zyk interfejsu</Label>
                    <Select defaultValue="pl">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">Polski</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Strefa czasowa</Label>
                    <Select defaultValue="europe/warsaw">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe/warsaw">Europa/Warszawa</SelectItem>
                        <SelectItem value="europe/london">Europa/Londyn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {isAdmin ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        ZarzÄ…dzanie uĹĽytkownikami
                      </div>
                      <Button onClick={() => setShowAddUserModal(true)}>
                        <UserIcon className="h-4 w-4 mr-2" />
                        Dodaj uĹĽytkownika
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-sm">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                              <div className="text-xs text-muted-foreground">Ostatnie logowanie: {user.lastLogin}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role === "admin" ? "Administrator" : user.role === "agent" ? "Agent" : "StaĹĽysta"}
                            </Badge>
                            <Select value={user.role} onValueChange={(value: any) => handleRoleChange(user.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                                <SelectItem value="intern">StaĹĽysta</SelectItem>
                              </SelectContent>
                            </Select>
                            <Switch checked={user.isActive} onCheckedChange={() => handleUserToggle(user.id)} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUserToDelete(user)
                                setShowDeleteUserModal(true)
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              UsuĹ„
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      SzczegĂłĹ‚owe uprawnienia uĹĽytkownikĂłw
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {users.map((user) => (
                        <div key={user.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-xs">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                {user.role === "admin" ? "Administrator" : user.role === "agent" ? "Agent" : "StaĹĽysta"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(modulePermissions).map(([module, permissions]) => (
                              <div key={module} className="border rounded p-3">
                                <h4 className="font-semibold text-sm mb-2 capitalize">{module}</h4>
                                <div className="space-y-2">
                                  {Object.entries(permissions).map(([permission, label]) => (
                                    <div key={permission} className="flex items-center justify-between">
                                      <Label className="text-xs">{label}</Label>
                                      <Switch
                                        checked={userPermissions[user.id]?.[`${module}.${permission}`] || false}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(user.id, module, permission, checked)
                                        }
                                        disabled={user.role === "admin"} // Admins have all permissions
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Uprawnienia rĂłl - przeglÄ…d
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-600">Administrator</h4>
                        <ul className="text-sm space-y-1">
                          <li>â€˘ PeĹ‚ny dostÄ™p do systemu</li>
                          <li>â€˘ ZarzÄ…dzanie uĹĽytkownikami</li>
                          <li>â€˘ Konfiguracja systemu</li>
                          <li>â€˘ Backup i przywracanie</li>
                          <li>â€˘ ZarzÄ…dzanie licencjami</li>
                          <li>â€˘ Wszystkie uprawnienia moduĹ‚Ăłw</li>
                          <li>â€˘ ZarzÄ…dzanie uprawnieniami</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Agent</h4>
                        <ul className="text-sm space-y-1">
                          <li>â€˘ ZarzÄ…dzanie polisami</li>
                          <li>â€˘ ObsĹ‚uga klientĂłw</li>
                          <li>â€˘ Generowanie raportĂłw</li>
                          <li>â€˘ Komunikacja elektroniczna</li>
                          <li>â€˘ ZarzÄ…dzanie zadaniami</li>
                          <li>â€˘ Przetwarzanie wznowieĹ„</li>
                          <li>â€˘ Zaawansowane funkcje</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-600">StaĹĽysta</h4>
                        <ul className="text-sm space-y-1">
                          <li>â€˘ PodglÄ…d polis (ograniczony)</li>
                          <li>â€˘ Podstawowa obsĹ‚uga klientĂłw</li>
                          <li>â€˘ Tworzenie zadaĹ„</li>
                          <li>â€˘ Podstawowe raporty</li>
                          <li>â€˘ Brak dostÄ™pu do ustawieĹ„</li>
                          <li>â€˘ Brak usuwania danych</li>
                          <li>â€˘ Nadzorowana praca</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {showAddUserModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">Dodaj nowego uĹĽytkownika</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-user-name">ImiÄ™ i nazwisko</Label>
                          <Input
                            id="new-user-name"
                            value={newUser.name}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Jan Kowalski"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-user-email">Adres e-mail</Label>
                          <Input
                            id="new-user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="jan@firma.pl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-user-role">Rola</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value: any) => setNewUser((prev) => ({ ...prev, role: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="intern">StaĹĽysta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-user-password">HasĹ‚o</Label>
                          <Input
                            id="new-user-password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                            placeholder="â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
                          Anuluj
                        </Button>
                        <Button onClick={handleAddUser}>Dodaj uĹĽytkownika</Button>
                      </div>
                    </div>
                  </div>
                )}

                {showDeleteUserModal && userToDelete && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4 text-red-600">UsuĹ„ uĹĽytkownika</h3>
                      <p className="mb-4">
                        Czy na pewno chcesz usunÄ…Ä‡ uĹĽytkownika <strong>{userToDelete.name}</strong>? Ta operacja jest
                        nieodwracalna.
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteUserModal(false)}>
                          Anuluj
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                          UsuĹ„ uĹĽytkownika
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Brak uprawnieĹ„</h3>
                  <p className="text-muted-foreground">
                    Tylko administratorzy mogÄ… zarzÄ…dzaÄ‡ uĹĽytkownikami i uprawnieniami.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="autologin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Konfiguracja auto-logowania towarzystw
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Konfiguracje sÄ… automatycznie zapisywane. MoĹĽesz rĂłwnieĹĽ zapisaÄ‡ rÄ™cznie.
                  </p>
                  <Button onClick={saveAutoLoginConfigs} variant="outline">
                    Zapisz wszystkie konfiguracje
                  </Button>
                </div>

                {insuranceCompanies.map((company) => {
                  const Icon = company.icon
                  const config = autoLoginConfigs[company.id]
                  return (
                    <Card key={company.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{company.name}</h3>
                            <p className="text-sm text-muted-foreground">{company.url}</p>
                          </div>
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => handleAutoLoginChange(company.id, "enabled", enabled)}
                        />
                      </div>

                      {config.enabled && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                          <div>
                            <Label htmlFor={`${company.id}-url`}>Adres URL</Label>
                            <Input
                              id={`${company.id}-url`}
                              value={config.url}
                              onChange={(e) => handleAutoLoginChange(company.id, "url", e.target.value)}
                              placeholder={company.url}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`${company.id}-username`}>Login</Label>
                              <Input
                                id={`${company.id}-username`}
                                value={config.username}
                                onChange={(e) => handleAutoLoginChange(company.id, "username", e.target.value)}
                                placeholder="nazwa_uzytkownika"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${company.id}-password`}>HasĹ‚o</Label>
                              <Input
                                id={`${company.id}-password`}
                                type="password"
                                value={config.password}
                                onChange={(e) => handleAutoLoginChange(company.id, "password", e.target.value)}
                                placeholder="â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘"
                              />
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Testuj poĹ‚Ä…czenie
                          </Button>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Bramka SMS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>WĹ‚Ä…cz bramkÄ™ SMS</Label>
                    <p className="text-sm text-muted-foreground">Konfiguracja wysyĹ‚ania wiadomoĹ›ci SMS</p>
                  </div>
                  <Switch checked={smsGatewayEnabled} onCheckedChange={setSmsGatewayEnabled} />
                </div>

                {smsGatewayEnabled && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="sms-gateway-url">URL bramki SMS</Label>
                      <Input
                        id="sms-gateway-url"
                        placeholder="https://api.smsgateway.pl/send"
                        value={smsGatewayUrl}
                        onChange={(e) => setSmsGatewayUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sms-api-key">Klucz API</Label>
                      <Input
                        id="sms-api-key"
                        type="password"
                        placeholder="â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘"
                        value={smsGatewayApiKey}
                        onChange={(e) => setSmsGatewayApiKey(e.target.value)}
                      />
                    </div>
                    <Button>Testuj poĹ‚Ä…czenie SMS</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Bramka e-mail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>WĹ‚Ä…cz bramkÄ™ e-mail</Label>
                    <p className="text-sm text-muted-foreground">Konfiguracja serwera SMTP do wysyĹ‚ania e-maili</p>
                  </div>
                  <Switch checked={emailGatewayEnabled} onCheckedChange={setEmailGatewayEnabled} />
                </div>

                {emailGatewayEnabled && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtp-server">Serwer SMTP</Label>
                        <Input
                          id="smtp-server"
                          placeholder="smtp.gmail.com"
                          value={emailSmtpServer}
                          onChange={(e) => setEmailSmtpServer(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtp-port">Port</Label>
                        <Input
                          id="smtp-port"
                          placeholder="587"
                          value={emailSmtpPort}
                          onChange={(e) => setEmailSmtpPort(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email-username">Nazwa uĹĽytkownika</Label>
                        <Input
                          id="email-username"
                          placeholder="twoj@email.com"
                          value={emailUsername}
                          onChange={(e) => setEmailUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-password">HasĹ‚o</Label>
                        <Input
                          id="email-password"
                          type="password"
                          placeholder="â€˘â€˘â€˘â€˘â€˘â€˘â€˘â€˘"
                          value={emailPassword}
                          onChange={(e) => setEmailPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button>Testuj poĹ‚Ä…czenie e-mail</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={saveSettings}>Zapisz ustawienia komunikacji</Button>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Podstawowe funkcje desktopowe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatyczne uruchamianie</Label>
                    <p className="text-sm text-muted-foreground">Uruchom aplikacjÄ™ przy starcie systemu</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.autoStart}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("autoStart", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Uruchom zminimalizowane</Label>
                    <p className="text-sm text-muted-foreground">Aplikacja uruchamia siÄ™ w tle</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.startMinimized}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("startMinimized", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Minimalizacja do zasobnika</Label>
                    <p className="text-sm text-muted-foreground">Minimalizuj do paska zadaĹ„ zamiast zamykania</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.minimizeToTray}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("minimizeToTray", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Zamknij do zasobnika</Label>
                    <p className="text-sm text-muted-foreground">KlikniÄ™cie X minimalizuje zamiast zamykaÄ‡</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.closeToTray}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("closeToTray", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ikona w zasobniku systemowym</Label>
                    <p className="text-sm text-muted-foreground">PokaĹĽ ikonÄ™ w prawym dolnym rogu</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.systemTrayIcon}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("systemTrayIcon", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  PrzeglÄ…darka i interfejs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>PrzeglÄ…darka wbudowana</Label>
                    <p className="text-sm text-muted-foreground">WĹ‚Ä…cz wbudowanÄ… przeglÄ…darkÄ™ w prawym panelu</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.builtInBrowser}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("builtInBrowser", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="window-position">Pozycja okna przy uruchomieniu</Label>
                  <Select
                    value={desktopFeatures.windowPosition}
                    onValueChange={(value) => handleDesktopFeatureChange("windowPosition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remember">ZapamiÄ™taj ostatniÄ… pozycjÄ™</SelectItem>
                      <SelectItem value="center">WyĹ›rodkuj na ekranie</SelectItem>
                      <SelectItem value="maximized">Zmaksymalizowane</SelectItem>
                      <SelectItem value="custom">Niestandardowa pozycja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="default-browser">DomyĹ›lna przeglÄ…darka zewnÄ™trzna</Label>
                  <div className="flex gap-2">
                    <Input
                      id="default-browser"
                      placeholder="C:\Program Files\Google\Chrome\chrome.exe"
                      value={desktopFeatures.defaultBrowserPath}
                      onChange={(e) => handleDesktopFeatureChange("defaultBrowserPath", e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Folder className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Powiadomienia i dĹşwiÄ™ki
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Powiadomienia dĹşwiÄ™kowe</Label>
                    <p className="text-sm text-muted-foreground">Odtwarzaj dĹşwiÄ™ki dla powiadomieĹ„</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.soundNotifications}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("soundNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatyczne aktualizacje</Label>
                    <p className="text-sm text-muted-foreground">Sprawdzaj i instaluj aktualizacje automatycznie</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.autoUpdate}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("autoUpdate", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  SkrĂłty klawiszowe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>WĹ‚Ä…cz skrĂłty klawiszowe</Label>
                    <p className="text-sm text-muted-foreground">Globalne skrĂłty klawiszowe dla szybkiego dostÄ™pu</p>
                  </div>
                  <Switch
                    checked={desktopFeatures.enableHotkeys}
                    onCheckedChange={(checked) => handleDesktopFeatureChange("enableHotkeys", checked)}
                  />
                </div>

                {desktopFeatures.enableHotkeys && (
                  <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hotkey-new-client">Nowy klient</Label>
                        <Input
                          id="hotkey-new-client"
                          value={desktopFeatures.hotkeyNewClient}
                          onChange={(e) => handleDesktopFeatureChange("hotkeyNewClient", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hotkey-search">Wyszukiwanie</Label>
                        <Input
                          id="hotkey-search"
                          value={desktopFeatures.hotkeySearch}
                          onChange={(e) => handleDesktopFeatureChange("hotkeySearch", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hotkey-task-planner">Planer zadaĹ„</Label>
                      <Input
                        id="hotkey-task-planner"
                        value={desktopFeatures.hotkeyTaskPlanner}
                        onChange={(e) => handleDesktopFeatureChange("hotkeyTaskPlanner", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  ĹšcieĹĽki i logi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="working-directory">Katalog roboczy</Label>
                  <div className="flex gap-2">
                    <Input
                      id="working-directory"
                      value={desktopFeatures.workingDirectory}
                      onChange={(e) => handleDesktopFeatureChange("workingDirectory", e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Folder className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="log-level">Poziom logowania</Label>
                    <Select
                      value={desktopFeatures.logLevel}
                      onValueChange={(value) => handleDesktopFeatureChange("logLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Tylko bĹ‚Ä™dy</SelectItem>
                        <SelectItem value="warn">OstrzeĹĽenia i bĹ‚Ä™dy</SelectItem>
                        <SelectItem value="info">Informacje</SelectItem>
                        <SelectItem value="debug">Debugowanie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max-log-files">Maksymalna liczba plikĂłw logĂłw</Label>
                    <Input
                      id="max-log-files"
                      type="number"
                      value={desktopFeatures.maxLogFiles}
                      onChange={(e) => handleDesktopFeatureChange("maxLogFiles", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Folder className="h-4 w-4 mr-2" />
                    OtwĂłrz katalog logĂłw
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Eksportuj logi
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveDesktopFeatures}>Zapisz ustawienia desktop</Button>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Konfiguracja sieci LAN
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="server-mode">Tryb pracy</Label>
                    <Select value={serverMode} onValueChange={setServerMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="server">Serwer</SelectItem>
                        <SelectItem value="client">Klient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="server-ip">Adres IP serwera</Label>
                    <Input id="server-ip" placeholder="192.168.1.100" disabled={serverMode === "server"} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input id="port" defaultValue="8080" />
                  </div>
                  <div>
                    <Label htmlFor="max-connections">Maksymalna liczba poĹ‚Ä…czeĹ„</Label>
                    <Input id="max-connections" defaultValue="10" disabled={serverMode === "client"} />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Wifi className="h-5 w-5 text-green-500" />
                  <span className="text-sm">
                    Status: {serverMode === "server" ? "Serwer aktywny" : "PoĹ‚Ä…czony z serwerem"}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveSettings}>Zapisz ustawienia sieci</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup i przywracanie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatyczny backup</Label>
                    <p className="text-sm text-muted-foreground">Wykonuj backup codziennie o 2:00</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backup-location">Lokalizacja backupu</Label>
                    <Input id="backup-location" defaultValue="C:\Agent21\Backup" />
                  </div>
                  <div>
                    <Label htmlFor="backup-retention">Przechowywanie (dni)</Label>
                    <Input id="backup-retention" defaultValue="30" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    UtwĂłrz backup
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    PrzywrĂłÄ‡ z backupu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="license" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  ZarzÄ…dzanie licencjÄ…
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System licencji</Label>
                    <p className="text-sm text-muted-foreground">WĹ‚Ä…cz weryfikacjÄ™ licencji (obecnie wyĹ‚Ä…czone)</p>
                  </div>
                  <Switch checked={licenseEnabled} onCheckedChange={setLicenseEnabled} disabled />
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Status licencji: WyĹ‚Ä…czona</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    System licencji jest obecnie wyĹ‚Ä…czony zgodnie z konfiguracjÄ…. Wszystkie funkcje sÄ… dostÄ™pne bez
                    ograniczeĹ„.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-key">Klucz licencyjny</Label>
                  <Input id="license-key" placeholder="WprowadĹş klucz licencyjny..." disabled />
                  <Button disabled>Aktywuj licencjÄ™</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
