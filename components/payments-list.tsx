"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Star,
  Edit,
  Eye,
  Car,
  Home,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  CreditCard,
  Check,
  X,
  Clock,
  Building,
} from "lucide-react"

interface Payment {
  id: string
  type: string
  installmentNumber: number
  policyNumber: string
  company: string
  companyLogo: string
  policyType: string
  issueDate: string
  dueAmount: number
  paidAmount?: number
  paidDate?: string
  status: "paid" | "overdue" | "pending"
  starred: boolean
  paymentForm: string
  installmentForm: string
  providerForm: string
}

const mockPayments: Payment[] = [
  {
    id: "1",
    type: "Komunikacyjne",
    installmentNumber: 1,
    policyNumber: "920008086010",
    company: "Warta",
    companyLogo: "W",
    policyType: "Komunikacyjne",
    issueDate: "2021-07-17",
    dueAmount: 2001.75,
    status: "pending",
    starred: true,
    paymentForm: "spłacona",
    installmentForm: "data",
    providerForm: "kwota",
  },
  {
    id: "2",
    type: "Warta Travel",
    installmentNumber: 1,
    policyNumber: "920004112032",
    company: "Warta",
    companyLogo: "W",
    policyType: "Warta Travel",
    issueDate: "2021-07-17",
    dueAmount: 201.25,
    paidAmount: 168.0,
    paidDate: "2021-06-29",
    status: "paid",
    starred: true,
    paymentForm: "spłacona",
    installmentForm: "data",
    providerForm: "kwota",
  },
  {
    id: "3",
    type: "Nnw",
    installmentNumber: 3,
    policyNumber: "908501363086",
    company: "Warta",
    companyLogo: "W",
    policyType: "Nnw",
    issueDate: "2021-07-16",
    dueAmount: 1132.02,
    status: "overdue",
    starred: false,
    paymentForm: "spłacona",
    installmentForm: "data",
    providerForm: "kwota",
  },
  {
    id: "4",
    type: "Flotowe",
    installmentNumber: 1,
    policyNumber: "908584758248",
    company: "Warta",
    companyLogo: "W",
    policyType: "Flotowe",
    issueDate: "2021-07-16",
    dueAmount: 2071.46,
    paidAmount: 1296.0,
    paidDate: "2021-06-15",
    status: "paid",
    starred: true,
    paymentForm: "spłacona",
    installmentForm: "data",
    providerForm: "kwota",
  },
  {
    id: "5",
    type: "Komunikacyjne",
    installmentNumber: 1,
    policyNumber: "912016048644",
    company: "Warta",
    companyLogo: "W",
    policyType: "Komunikacyjne",
    issueDate: "2021-07-16",
    dueAmount: 202.27,
    status: "overdue",
    starred: false,
    paymentForm: "spłacona",
    installmentForm: "data",
    providerForm: "kwota",
  },
]

export function PaymentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("2021-07-14")
  const [dateTo, setDateTo] = useState("2021-07-30")
  const [payments] = useState(mockPayments)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.policyType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesCompany = companyFilter === "all" || payment.company === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="w-4 h-4 text-green-600" />
      case "overdue":
        return <X className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
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

  const getPaymentTypeIcon = (type: string) => {
    if (type.includes("Komunikacyjne") || type.includes("Flotowe")) {
      return <Car className="w-4 h-4 text-gray-600" />
    }
    if (type.includes("Travel")) {
      return <Building className="w-4 h-4 text-gray-600" />
    }
    return <Home className="w-4 h-4 text-gray-600" />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Spłaty
          </CardTitle>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nowa
              </Button>

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
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>Filtruj według:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[status spłat]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="paid">Opłacone</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="overdue">Przeterminowane</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[typ spłaty]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="installment">Ratalne</SelectItem>
                  <SelectItem value="full">Jednorazowe</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[firma]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="Warta">Warta</SelectItem>
                  <SelectItem value="PZU">PZU</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[forma płatn.]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="transfer">Przelew</SelectItem>
                  <SelectItem value="cash">Gotówka</SelectItem>
                  <SelectItem value="card">Karta</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[prowizja]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="with">Z prowizją</SelectItem>
                  <SelectItem value="without">Bez prowizji</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>data wymagalności</span>
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
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Nr raty</TableHead>
                <TableHead>Spłata do polisy</TableHead>
                <TableHead>Grupa</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Data wymagalności (raty)</TableHead>
                <TableHead>Kwota</TableHead>
                <TableHead>Dane kontaktowe</TableHead>
                <TableHead>Spłata</TableHead>
                <TableHead>data</TableHead>
                <TableHead>kwota</TableHead>
                <TableHead>forma płatności</TableHead>
                <TableHead>rozli-czenia</TableHead>
                <TableHead>pro-wizja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Search className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Star
                          className={`w-3 h-3 ${payment.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentTypeIcon(payment.type)}
                      <span className="text-sm">{payment.type}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-center">{payment.installmentNumber}</div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{payment.policyNumber}</div>
                      <div className="text-xs text-gray-500">{payment.policyType}</div>
                    </div>
                  </TableCell>

                  <TableCell>{getPaymentTypeIcon(payment.type)}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCompanyLogo(payment.company, payment.companyLogo)}
                      <span className="text-sm">{payment.company}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{payment.issueDate}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium">{payment.dueAmount.toFixed(2)} zł</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Building className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Calendar className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Car className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(payment.status)}</TableCell>

                  <TableCell>
                    <div className="text-sm">{payment.paidDate || "-"}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{payment.paidAmount ? `${payment.paidAmount.toFixed(2)} zł` : "-"}</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Building className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Pozycje 1 - 165 z 165</div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Strona 1 z 1</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Select defaultValue="500">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
