"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Download, RefreshCw, CheckCircle, Globe } from "lucide-react"

interface BrowserPolicyImportProps {
  onBack: () => void
}

interface PolicyData {
  id: string
  number: string
  client: string
  company: string
  product: string
  startDate: string
  endDate: string
  premium: number
  status: "active" | "expired" | "pending"
}

export function BrowserPolicyImport({ onBack }: BrowserPolicyImportProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])

  const insuranceCompanies = [
    { id: "warta", name: "Warta", url: "https://agent.warta.pl" },
    { id: "pzu", name: "PZU", url: "https://agent.pzu.pl" },
    { id: "allianz", name: "Allianz", url: "https://agent.allianz.pl" },
    { id: "generali", name: "Generali", url: "https://agent.generali.pl" },
    { id: "uniqa", name: "Uniqa", url: "https://agent.uniqa.pl" },
    { id: "ergo", name: "Ergo Hestia", url: "https://agent.ergohestia.pl" },
  ]

  const mockPolicies: PolicyData[] = [
    {
      id: "1",
      number: "92008275036",
      client: "Jan Kowalski",
      company: "Warta",
      product: "Komunikacyjne",
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      premium: 1250.0,
      status: "active",
    },
    {
      id: "2",
      number: "92004112032",
      client: "Anna Nowak",
      company: "Warta",
      product: "Dom",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      premium: 850.0,
      status: "active",
    },
    {
      id: "3",
      number: "90856473086",
      client: "Piotr Wiśniewski",
      company: "Warta",
      product: "Komunikacyjne",
      startDate: "2023-12-10",
      endDate: "2024-12-09",
      premium: 1100.0,
      status: "expired",
    },
  ]

  const handleConnect = async (companyId: string) => {
    setSelectedCompany(companyId)
    setIsLoading(true)

    // Simulate connection to insurance company system
    setTimeout(() => {
      setIsConnected(true)
      setPolicies(mockPolicies)
      setIsLoading(false)
    }, 2000)
  }

  const handleImportSelected = () => {
    const selectedPolicyData = policies.filter((p) => selectedPolicies.includes(p.id))
    console.log("[v0] Importing selected policies:", selectedPolicyData)
    // Here would be the actual import logic
    alert(`Zaimportowano ${selectedPolicyData.length} polis z systemu ${selectedCompany.toUpperCase()}`)
    onBack()
  }

  const handleImportAll = () => {
    console.log("[v0] Importing all policies:", policies)
    // Here would be the actual import logic
    alert(`Zaimportowano wszystkie ${policies.length} polis z systemu ${selectedCompany.toUpperCase()}`)
    onBack()
  }

  const togglePolicySelection = (policyId: string) => {
    setSelectedPolicies((prev) =>
      prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <h2 className="text-2xl font-bold">Import polis z przeglądarki TU</h2>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Wybierz towarzystwo ubezpieczeniowe
            </CardTitle>
            <CardDescription>
              Połącz się z systemem TU aby zaimportować polisy z zalogowanej sesji przeglądarki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {insuranceCompanies.map((company) => (
                <Button
                  key={company.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  onClick={() => handleConnect(company.id)}
                  disabled={isLoading}
                >
                  {isLoading && selectedCompany === company.id ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {company.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm">{company.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Połączono z {selectedCompany.toUpperCase()}
              </CardTitle>
              <CardDescription>
                Znaleziono {policies.length} polis w systemie. Wybierz polisy do importu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Button onClick={handleImportAll} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Importuj wszystkie ({policies.length})
                </Button>
                <Button variant="outline" onClick={handleImportSelected} disabled={selectedPolicies.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Importuj wybrane ({selectedPolicies.length})
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium text-sm border-b">
                  <div className="grid grid-cols-8 gap-4">
                    <div>Wybierz</div>
                    <div>Nr polisy</div>
                    <div>Klient</div>
                    <div>Produkt</div>
                    <div>Data od</div>
                    <div>Data do</div>
                    <div>Składka</div>
                    <div>Status</div>
                  </div>
                </div>
                <div className="divide-y">
                  {policies.map((policy) => (
                    <div key={policy.id} className="px-4 py-3 hover:bg-gray-50">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div>
                          <Checkbox
                            checked={selectedPolicies.includes(policy.id)}
                            onCheckedChange={() => togglePolicySelection(policy.id)}
                          />
                        </div>
                        <div className="font-mono text-sm">{policy.number}</div>
                        <div>{policy.client}</div>
                        <div>{policy.product}</div>
                        <div>{policy.startDate}</div>
                        <div>{policy.endDate}</div>
                        <div>{policy.premium.toFixed(2)} zł</div>
                        <div>
                          <Badge
                            variant={
                              policy.status === "active"
                                ? "default"
                                : policy.status === "expired"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {policy.status === "active"
                              ? "Aktywna"
                              : policy.status === "expired"
                                ? "Wygasła"
                                : "Oczekująca"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
