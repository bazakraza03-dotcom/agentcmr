"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewClientForm } from "@/components/new-client-form"
import { ClientPreviewModal } from "@/components/client-preview-modal"
import { AddNoteModal } from "@/components/add-note-modal"
import { AddReminderModal } from "@/components/add-reminder-modal"
import { X } from "lucide-react"
import {
  Search,
  Users,
  Edit,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  Car,
  Home,
  Star,
  Shield,
  UserCheck,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Client {
  id: string
  name: string
  type: "individual" | "company"
  email: string
  phone: string
  address: string
  pesel?: string
  nip?: string
  regon?: string
  policies: ClientPolicy[]
  totalPolicies: number
  activeVehicles: number
  totalPremium: number
  lastContact: string
  status: "active" | "inactive" | "prospect"
  created_by: string
  created_by_role: "admin" | "agent" | "intern"
  created_at: string
}

interface ClientPolicy {
  id: string
  number: string
  company: string
  companyLogo: string
  type: string
  issueDate: string
  expiryDate: string
  premium: number
  status: "active" | "expired" | "cancelled"
  starred: boolean
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Bogusław Kalinowski",
    type: "individual",
    email: "boguslaw.kalinowski@email.com",
    phone: "+48 123 456 789",
    address: "ul. Przykładowa 123, 00-001 Warszawa",
    pesel: "80010112345",
    policies: [
      {
        id: "1",
        number: "90856725072",
        company: "Warta",
        companyLogo: "W",
        type: "Flotowe",
        issueDate: "2021-07-14",
        expiryDate: "2022-08-11",
        premium: 2001.75,
        status: "active",
        starred: true,
      },
      {
        id: "2",
        number: "90852648753",
        company: "Warta",
        companyLogo: "W",
        type: "Flotowe",
        issueDate: "2021-07-14",
        expiryDate: "2022-08-10",
        premium: 201.25,
        status: "active",
        starred: true,
      },
    ],
    totalPolicies: 165,
    activeVehicles: 12,
    totalPremium: 45678.9,
    lastContact: "2021-07-15",
    status: "active",
    created_by: "admin@firma.pl",
    created_by_role: "admin",
    created_at: "2021-07-10",
  },
  {
    id: "2",
    name: "Anna Kowalska",
    type: "individual",
    email: "anna.kowalska@email.com",
    phone: "+48 987 654 321",
    address: "ul. Testowa 456, 00-002 Kraków",
    pesel: "75020298765",
    policies: [
      {
        id: "3",
        number: "90853240584",
        company: "Warta",
        companyLogo: "W",
        type: "Komunikacyjne",
        issueDate: "2021-07-14",
        expiryDate: "2022-08-07",
        premium: 1132.02,
        status: "active",
        starred: false,
      },
    ],
    totalPolicies: 3,
    activeVehicles: 2,
    totalPremium: 3456.78,
    lastContact: "2021-07-10",
    status: "active",
    created_by: "agent@firma.pl",
    created_by_role: "agent",
    created_at: "2021-07-08",
  },
  {
    id: "3",
    name: "Firma ABC Sp. z o.o.",
    type: "company",
    email: "kontakt@firmaabc.pl",
    phone: "+48 555 123 456",
    address: "ul. Biznesowa 789, 00-003 Gdańsk",
    nip: "1234567890",
    regon: "123456789",
    policies: [
      {
        id: "4",
        number: "90857834753",
        company: "PZU",
        companyLogo: "P",
        type: "Flotowe",
        issueDate: "2021-07-14",
        expiryDate: "2022-08-11",
        premium: 15000.0,
        status: "active",
        starred: true,
      },
    ],
    totalPolicies: 25,
    activeVehicles: 45,
    totalPremium: 125000.0,
    lastContact: "2021-07-12",
    status: "active",
    created_by: "stazysta@firma.pl",
    created_by_role: "intern",
    created_at: "2021-07-05",
  },
]

export function ClientsList() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clients, setClients] = useState(mockClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [view, setView] = useState<"list" | "details">("list")
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showEditClientForm, setShowEditClientForm] = useState(false)
  const [showClientPreview, setShowClientPreview] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const filteredClients = clients.filter((client) => {
    if (user?.role === "intern" && client.created_by !== user.email) {
      return false
    }

    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.pesel?.includes(searchTerm) ||
      client.nip?.includes(searchTerm)

    const matchesType = typeFilter === "all" || client.type === typeFilter
    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Nieaktywny</Badge>
      case "prospect":
        return <Badge className="bg-blue-100 text-blue-800">Prospect</Badge>
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

  const getCreatorBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
        )
      case "agent":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <UserCheck className="w-3 h-3 mr-1" />
            Agent
          </Badge>
        )
      case "intern":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <User className="w-3 h-3 mr-1" />
            Stażysta
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {role}
          </Badge>
        )
    }
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setView("details")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedClient(null)
  }

  const handleNewClient = (clientData: any) => {
    const newClient = {
      ...clientData,
      created_by: user?.email || "unknown",
      created_by_role: user?.role || "intern",
      created_at: new Date().toISOString().split("T")[0],
    }
    setClients((prev) => [newClient, ...prev])
    console.log("[v0] New client created:", newClient)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowEditClientForm(true)
  }

  const handlePreviewClient = (client: Client) => {
    setSelectedClient(client)
    setShowClientPreview(true)
  }

  const handleAddNote = (client: Client) => {
    setSelectedClient(client)
    setShowAddNote(true)
  }

  const handleAddReminder = (client: Client) => {
    setSelectedClient(client)
    setShowAddReminder(true)
  }

  const handleUpdateClient = (updatedClient: any) => {
    setClients((prev) => prev.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    setShowEditClientForm(false)
    setEditingClient(null)
    console.log("[v0] Client updated:", updatedClient)
  }

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Czy na pewno chcesz usunąć klienta ${client.name}?`)) {
      setClients((prev) => prev.filter((c) => c.id !== client.id))
      console.log("[v0] Client deleted:", client.name)
    }
  }

  if (view === "details" && selectedClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Powrót
          </Button>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Edycja danych klienta {selectedClient.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedClient.type === "individual" ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                Dane klienta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Nazwa/Imię i nazwisko:</strong>
                <div>{selectedClient.name}</div>
              </div>

              <div>
                <strong>Typ:</strong>
                <div>{selectedClient.type === "individual" ? "Osoba fizyczna" : "Firma"}</div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <div>{selectedClient.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <div>{selectedClient.phone}</div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <div>{selectedClient.address}</div>
              </div>

              {selectedClient.pesel && (
                <div>
                  <strong>PESEL:</strong>
                  <div>{selectedClient.pesel}</div>
                </div>
              )}

              {selectedClient.nip && (
                <div>
                  <strong>NIP:</strong>
                  <div>{selectedClient.nip}</div>
                </div>
              )}

              {selectedClient.regon && (
                <div>
                  <strong>REGON:</strong>
                  <div>{selectedClient.regon}</div>
                </div>
              )}

              <div>
                <strong>Status:</strong>
                <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
              </div>

              <div>
                <strong>Ostatni kontakt:</strong>
                <div>{selectedClient.lastContact}</div>
              </div>

              <div>
                <strong>Dodane przez:</strong>
                <div className="mt-1">{getCreatorBadge(selectedClient.created_by_role)}</div>
                <div className="text-sm text-gray-500">{selectedClient.created_by}</div>
                <div className="text-sm text-gray-400">{selectedClient.created_at}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lista polis klienta
              </CardTitle>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClient.policies.map((policy) => (
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
                        <div className="text-sm">Szczegóły przedmiotu</div>
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

                      <TableCell>
                        <Badge
                          className={
                            policy.status === "active"
                              ? "bg-green-100 text-green-800"
                              : policy.status === "expired"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {policy.status === "active"
                            ? "Aktywna"
                            : policy.status === "expired"
                              ? "Wygasła"
                              : "Anulowana"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 text-sm text-gray-500">Pozycje 1 - 50 z {selectedClient.totalPolicies}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Klienci
            {user?.role === "intern" && (
              <Badge variant="outline" className="ml-2 text-xs">
                Widok stażysty - tylko Twoi klienci
              </Badge>
            )}
          </CardTitle>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowNewClientForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nowy klient
              </Button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nazwa/ Imię/ Nazwisko/ PESEL/ NIP/ Email/ Telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>Filtruj według:</span>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="[typ klienta]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy</SelectItem>
                  <SelectItem value="individual">Osoby fizyczne</SelectItem>
                  <SelectItem value="company">Firmy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[status]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="active">Aktywni</SelectItem>
                  <SelectItem value="inactive">Nieaktywni</SelectItem>
                  <SelectItem value="prospect">Prospekty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Akcje</TableHead>
                <TableHead>Nazwa / Imię i nazwisko</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Identyfikatory</TableHead>
                <TableHead>Polisy</TableHead>
                <TableHead>Pojazdy</TableHead>
                <TableHead>Składka roczna</TableHead>
                <TableHead>Ostatni kontakt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dodane przez</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditClient(client)}
                        title="Edytuj klienta"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handlePreviewClient(client)}
                        title="Podgląd klienta"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAddNote(client)}
                        title="Dodaj uwagę"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAddReminder(client)}
                        title="Dodaj przypomnienie"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClient(client)}
                        title="Usuń klienta"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.type === "individual" ? (
                        <User className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Building className="w-4 h-4 text-gray-600" />
                      )}
                      <div className="font-medium">{client.name}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{client.type === "individual" ? "Osoba fizyczna" : "Firma"}</div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {client.pesel && <div>PESEL: {client.pesel}</div>}
                      {client.nip && <div>NIP: {client.nip}</div>}
                      {client.regon && <div>REGON: {client.regon}</div>}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-center font-medium">{client.totalPolicies}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-center font-medium">{client.activeVehicles}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium">{client.totalPremium.toLocaleString("pl-PL")} zł</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{client.lastContact}</div>
                  </TableCell>

                  <TableCell>{getStatusBadge(client.status)}</TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {getCreatorBadge(client.created_by_role)}
                      <div className="text-xs text-gray-500">{client.created_by}</div>
                      <div className="text-xs text-gray-400">{client.created_at}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Pozycje 1 - 50 z 1247</div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Strona 1 z 25</span>
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

      <NewClientForm open={showNewClientForm} onOpenChange={setShowNewClientForm} onSubmit={handleNewClient} />

      {editingClient && (
        <NewClientForm
          open={showEditClientForm}
          onOpenChange={setShowEditClientForm}
          onSubmit={handleUpdateClient}
          initialData={editingClient}
          mode="edit"
        />
      )}

      {selectedClient && (
        <ClientPreviewModal open={showClientPreview} onOpenChange={setShowClientPreview} client={selectedClient} />
      )}

      {selectedClient && (
        <AddNoteModal
          open={showAddNote}
          onOpenChange={setShowAddNote}
          client={selectedClient}
          onSubmit={(note) => {
            console.log("[v0] Note added for client:", selectedClient.name, note)
            setShowAddNote(false)
          }}
        />
      )}

      {selectedClient && (
        <AddReminderModal
          open={showAddReminder}
          onOpenChange={setShowAddReminder}
          client={selectedClient}
          onSubmit={(reminder) => {
            console.log("[v0] Reminder added for client:", selectedClient.name, reminder)
            setShowAddReminder(false)
          }}
        />
      )}
    </div>
  )
}
