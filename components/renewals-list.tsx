"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Star,
  Car,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  User,
  Check,
  X,
  Clock,
  AlertTriangle,
  Filter,
} from "lucide-react"

interface Renewal {
  id: string
  type: string
  policyNumber: string
  company: string
  companyLogo: string
  expirationDate: string
  premium: number
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  communicationStatus: {
    email: "sent" | "pending" | "failed"
    sms: "sent" | "pending" | "failed"
    phone: "completed" | "pending" | "failed"
  }
  renewalStatus: "pending" | "completed" | "expired" | "cancelled"
  starred: boolean
  priority: "high" | "medium" | "low"
}

const mockRenewals: Renewal[] = [
  {
    id: "1",
    type: "Warta Dom",
    policyNumber: "920082750536",
    company: "Warta",
    companyLogo: "W",
    expirationDate: "2021-07-12",
    premium: 399.9,
    clientName: "Faulina Woźniak",
    clientPhone: "+64 511131140",
    clientEmail: "608zwbe2boj@1y.12",
    clientAddress: "ul. Przykładowa 123",
    communicationStatus: {
      email: "sent",
      sms: "sent",
      phone: "pending",
    },
    renewalStatus: "pending",
    starred: false,
    priority: "high",
  },
  {
    id: "2",
    type: "Warta Dom",
    policyNumber: "920008770088",
    company: "Warta",
    companyLogo: "W",
    expirationDate: "2021-07-13",
    premium: 853.3,
    clientName: "Karol Bąk",
    clientPhone: "+63 716154013",
    clientEmail: "gp6ai61@weg1.gph",
    clientAddress: "ul. Testowa 456",
    communicationStatus: {
      email: "sent",
      sms: "sent",
      phone: "completed",
    },
    renewalStatus: "completed",
    starred: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "Komunikacyjne",
    policyNumber: "920057444433",
    company: "Warta",
    companyLogo: "W",
    expirationDate: "2021-07-13",
    premium: 595.31,
    clientName: "Bartosz Kozłowski",
    clientPhone: "+28 153761208",
    clientEmail: "w1kqd2xql5u1hjdul@indlr",
    clientAddress: "ul. Główna 789",
    communicationStatus: {
      email: "sent",
      sms: "sent",
      phone: "completed",
    },
    renewalStatus: "completed",
    starred: true,
    priority: "high",
  },
  {
    id: "4",
    type: "OC Medyczna",
    policyNumber: "101817336250",
    company: "Warta",
    companyLogo: "W",
    expirationDate: "2021-07-13",
    premium: 1140.6,
    clientName: "Dagmara Duda",
    clientPhone: "+74 866533523",
    clientEmail: "contact@example.com",
    clientAddress: "ul. Nowa 321",
    communicationStatus: {
      email: "failed",
      sms: "sent",
      phone: "pending",
    },
    renewalStatus: "pending",
    starred: false,
    priority: "high",
  },
  {
    id: "5",
    type: "Warta Dom Komfort",
    policyNumber: "920034824113",
    company: "Warta",
    companyLogo: "W",
    expirationDate: "2021-07-14",
    premium: 1284.08,
    clientName: "Mirosław Adamczyk",
    clientPhone: "+20 000582534",
    clientEmail: "miroslaw@test.pl",
    clientAddress: "ul. Długa 654",
    communicationStatus: {
      email: "sent",
      sms: "sent",
      phone: "completed",
    },
    renewalStatus: "completed",
    starred: false,
    priority: "medium",
  },
]

export function RenewalsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("2021-07-05")
  const [dateTo, setDateTo] = useState("2021-08-02")
  const [renewals] = useState(mockRenewals)
  const [selectedRenewals, setSelectedRenewals] = useState<string[]>([])

  const filteredRenewals = renewals.filter((renewal) => {
    const matchesSearch =
      renewal.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || renewal.renewalStatus === statusFilter
    const matchesCompany = companyFilter === "all" || renewal.company === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "expired":
        return <X className="w-4 h-4 text-red-600" />
      case "cancelled":
        return <X className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getCommunicationStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-green-600" />
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getCompanyLogo = (company: string, logo: string) => {
    const colors: Record<string, string> = {
      Warta: "bg-blue-600",
      PZU: "bg-red-600",
      Allianz: "bg-blue-800",
      AXA: "bg-red-500",
    }

    return (
      <div
        className={`w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center ${colors[company] || "bg-gray-600"}`}
      >
        {logo}
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 text-xs">Wysoki</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Średni</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 text-xs">Niski</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {priority}
          </Badge>
        )
    }
  }

  const handleSelectRenewal = (renewalId: string, checked: boolean) => {
    if (checked) {
      setSelectedRenewals([...selectedRenewals, renewalId])
    } else {
      setSelectedRenewals(selectedRenewals.filter((id) => id !== renewalId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRenewals(filteredRenewals.map((r) => r.id))
    } else {
      setSelectedRenewals([])
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Wznowienia wybrano 2 szt.
          </CardTitle>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nr polisy/ Nazwisko/ PESEL, NIP, REG..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="OWCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="Warta">Warta</SelectItem>
                  <SelectItem value="PZU">PZU</SelectItem>
                  <SelectItem value="Allianz">Allianz</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-green-100">
                <Calendar className="w-4 h-4" />
              </Button>

              <Button variant="outline">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>data ekspiracji</span>
              <span>od dnia:</span>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
              <span>do dnia:</span>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />

              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>Korespondencja seryjna:</span>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="[szybki wybór]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="phone">Telefon</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-blue-100">
                  <Mail className="w-4 h-4 mr-1" />
                  wyślij maile
                  <Badge className="ml-1 bg-blue-600 text-white text-xs">6</Badge>
                </Button>
                <Button variant="outline" size="sm" className="bg-green-100">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  wyślij SMS
                  <Badge className="ml-1 bg-green-600 text-white text-xs">8</Badge>
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-100">
                  <FileText className="w-4 h-4 mr-1" />
                  wyślij listy
                  <Badge className="ml-1 bg-purple-600 text-white text-xs">9</Badge>
                </Button>
                <Button variant="outline" size="sm" className="bg-orange-100">
                  <FileText className="w-4 h-4 mr-1" />
                  drukuj listę
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRenewals.length === filteredRenewals.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Polisa</TableHead>
                <TableHead>Grupa</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Data ekspiracji</TableHead>
                <TableHead>Kwota raty</TableHead>
                <TableHead>Dane kontaktowe</TableHead>
                <TableHead>powiadomienie</TableHead>
                <TableHead>status</TableHead>
                <TableHead>
                  oferta
                  <br />
                  wznowienia
                </TableHead>
                <TableHead>
                  koniec
                  <br />
                  umowy
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRenewals.map((renewal) => (
                <TableRow key={renewal.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRenewals.includes(renewal.id)}
                      onCheckedChange={(checked) => handleSelectRenewal(renewal.id, !!checked)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Search className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Star
                            className={`w-3 h-3 ${renewal.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Car className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-green-100 px-1 rounded">2/3</span>
                        <RefreshCw className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{renewal.policyNumber}</div>
                      <div className="text-xs text-gray-500">{renewal.type}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renewal.type.includes("Dom") ? (
                        <Home className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Car className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCompanyLogo(renewal.company, renewal.companyLogo)}
                      <span className="text-sm">{renewal.company}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-red-600 font-medium">{renewal.expirationDate}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium">{renewal.premium.toFixed(2)} zł</div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium">{renewal.clientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{renewal.clientPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{renewal.clientEmail}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {getCommunicationStatus(renewal.communicationStatus.sms)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {getCommunicationStatus(renewal.communicationStatus.email)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {getCommunicationStatus(renewal.communicationStatus.phone)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(renewal.renewalStatus)}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Pozycje 1 - 50 z 259</div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Strona 1 z 6</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Select defaultValue="50">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
