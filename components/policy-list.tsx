"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Edit, Eye, Trash2, Car, Home, ChevronLeft, ChevronRight } from "lucide-react"

interface Policy {
  id: string
  number: string
  company: string
  companyLogo: string
  type: string
  client: string
  issueDate: string
  expiryDate: string
  status: "active" | "expired" | "pending"
  starred: boolean
  premium: number
}

const mockPolicies: Policy[] = [
  {
    id: "1",
    number: "90856725072",
    company: "Warta",
    companyLogo: "W",
    type: "Flotowe",
    client: "5554689 DAF",
    issueDate: "2021-07-14",
    expiryDate: "2022-08-11",
    status: "active",
    starred: true,
    premium: 2001.75,
  },
  {
    id: "2",
    number: "90852648753",
    company: "Warta",
    companyLogo: "W",
    type: "Flotowe",
    client: "OZ1277N VOLKSWAGEN",
    issueDate: "2021-07-14",
    expiryDate: "2022-08-10",
    status: "active",
    starred: true,
    premium: 201.25,
  },
  {
    id: "3",
    number: "90853240584",
    company: "Warta",
    companyLogo: "W",
    type: "Flotowe",
    client: "GD6257P LAND ROVER",
    issueDate: "2021-07-14",
    expiryDate: "2022-08-07",
    status: "active",
    starred: true,
    premium: 1132.02,
  },
  {
    id: "4",
    number: "90857834753",
    company: "Warta",
    companyLogo: "W",
    type: "Flotowe",
    client: "XW3653B JEEP",
    issueDate: "2021-07-14",
    expiryDate: "2022-08-11",
    status: "active",
    starred: true,
    premium: 2071.46,
  },
  {
    id: "5",
    number: "90857604248",
    company: "Warta",
    companyLogo: "W",
    type: "Flotowe",
    client: "5F01071 SKODA",
    issueDate: "2021-07-13",
    expiryDate: "2022-07-14",
    status: "expired",
    starred: true,
    premium: 202.27,
  },
]

interface PolicyListProps {
  onEditPolicy: (policyId: string) => void
}

export function PolicyList({ onEditPolicy }: PolicyListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [policies] = useState(mockPolicies)

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || policy.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktywna</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Wygasła</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Oczekująca</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Lista polis klienta
        </CardTitle>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Nr polisy/ Nr rej/ VIN/ Nazwisko/ PESEL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status polisy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="expired">Wygasłe</SelectItem>
              <SelectItem value="pending">Oczekujące</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nr polisy / produkt</TableHead>
              <TableHead>Podgląd</TableHead>
              <TableHead>Grupa</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Przedmiot ubezp.</TableHead>
              <TableHead>Data wyst.</TableHead>
              <TableHead>Okres ochrony</TableHead>
              <TableHead>Status poli</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Star
                      className={`w-4 h-4 ${policy.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  </Button>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{policy.number}</div>
                    <div className="text-sm text-gray-500">{policy.type}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCompanyLogo(policy.company, policy.companyLogo)}
                    <Car className="w-4 h-4 text-gray-400" />
                    <Home className="w-4 h-4 text-gray-400" />
                  </div>
                </TableCell>

                <TableCell>
                  <Car className="w-4 h-4 text-gray-600" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCompanyLogo(policy.company, policy.companyLogo)}
                    <span className="text-sm">{policy.company}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">{policy.client}</div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">{policy.issueDate}</div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{policy.issueDate}</div>
                    <div className="text-sm">{policy.expiryDate}</div>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(policy.status)}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEditPolicy(policy.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">Pozycje 1 - 50 z 378</div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Strona 1 z 8</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
