"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Server, Users } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [serverMode, setServerMode] = useState<"server" | "client">("client")
  const [serverAddress, setServerAddress] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const demoCredentials = {
    "admin@firma.pl": { password: "Administrator", role: "admin" as const },
    "agent@firma.pl": { password: "Agent", role: "agent" as const },
    "stazysta@firma.pl": { password: "Stazysta", role: "intern" as const },
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login attempt:", { email, password })

    try {
      const credentials = demoCredentials[email as keyof typeof demoCredentials]

      if (!credentials) {
        if (email.includes("frima.pl")) {
          setError("Sprawdź pisownię: użyj 'firma.pl' zamiast 'frima.pl'")
        } else {
          setError("Nieprawidłowy email. Użyj jednego z kont demo poniżej.")
        }
        return
      }

      if (credentials.password !== password) {
        setError("Nieprawidłowe hasło.")
        return
      }

      const userData = {
        email,
        role: credentials.role,
        serverMode,
        serverAddress: serverMode === "client" ? serverAddress : "localhost",
      }

      console.log("[v0] Login successful:", userData)
      localStorage.setItem("agent21_user", JSON.stringify(userData))
      window.location.href = "/"
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError("Błąd logowania. Sprawdź dane i spróbuj ponownie.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A21</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Agent21</h1>
          <p className="text-gray-600">System zarządzania ubezpieczeniami</p>
        </div>

        {/* Installation Mode Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="w-5 h-5" />
              Tryb instalacji
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={serverMode} onValueChange={(value: "server" | "client") => setServerMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Serwer (LAN)
                  </div>
                </SelectItem>
                <SelectItem value="client">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Klient (połączenie z serwerem)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {serverMode === "client" && (
              <div className="mt-3">
                <Label htmlFor="serverAddress">Adres serwera</Label>
                <Input
                  id="serverAddress"
                  placeholder="192.168.1.100:3000"
                  value={serverAddress}
                  onChange={(e) => setServerAddress(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Logowanie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@firma.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Hasło</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>
                <strong>Demo konta:</strong>
              </p>
              <p className="font-mono">admin@firma.pl - Administrator</p>
              <p className="font-mono">agent@firma.pl - Agent</p>
              <p className="font-mono">stazysta@firma.pl - Stażysta</p>
              <p className="text-amber-600 mt-2">⚠️ Uwaga: Sprawdź pisownię "firma.pl"</p>
            </div>
          </CardContent>
        </Card>

        {/* License Info */}
        <div className="text-center text-xs text-gray-500">
          <p>Licencja: Wersja demonstracyjna</p>
          <p>© 2024 Agent21 - System LAN</p>
        </div>
      </div>
    </div>
  )
}
