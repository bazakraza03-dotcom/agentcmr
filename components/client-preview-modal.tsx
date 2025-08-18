"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { User, Building, Phone, Mail, MapPin, FileText, Car, Star } from "lucide-react"

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
}

interface ClientPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
}

export function ClientPreviewModal({ open, onOpenChange, client }: ClientPreviewModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {client.type === "individual" ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
            Podgląd klienta: {client.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {client.type === "individual" ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                Dane klienta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Nazwa/Imię i nazwisko:</strong>
                <div>{client.name}</div>
              </div>

              <div>
                <strong>Typ:</strong>
                <div>{client.type === "individual" ? "Osoba fizyczna" : "Firma"}</div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <div>{client.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <div>{client.phone}</div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <div>{client.address}</div>
              </div>

              {client.pesel && (
                <div>
                  <strong>PESEL:</strong>
                  <div>{client.pesel}</div>
                </div>
              )}

              {client.nip && (
                <div>
                  <strong>NIP:</strong>
                  <div>{client.nip}</div>
                </div>
              )}

              {client.regon && (
                <div>
                  <strong>REGON:</strong>
                  <div>{client.regon}</div>
                </div>
              )}

              <div>
                <strong>Status:</strong>
                <div className="mt-1">{getStatusBadge(client.status)}</div>
              </div>

              <div>
                <strong>Ostatni kontakt:</strong>
                <div>{client.lastContact}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{client.totalPolicies}</div>
                  <div className="text-sm text-gray-500">Polisy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{client.activeVehicles}</div>
                  <div className="text-sm text-gray-500">Pojazdy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {client.totalPremium.toLocaleString("pl-PL")} zł
                  </div>
                  <div className="text-sm text-gray-500">Składka</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Policies and Vehicles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Polisy klienta ({client.policies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nr polisy</TableHead>
                      <TableHead>Firma</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Data wyst.</TableHead>
                      <TableHead>Wygaśnięcie</TableHead>
                      <TableHead>Składka</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.policies.map((policy) => (
                      <TableRow key={policy.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Star
                              className={`w-4 h-4 ${policy.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{policy.number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCompanyLogo(policy.company, policy.companyLogo)}
                            <span className="text-sm">{policy.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>{policy.type}</TableCell>
                        <TableCell>{policy.issueDate}</TableCell>
                        <TableCell>{policy.expiryDate}</TableCell>
                        <TableCell>{policy.premium.toLocaleString("pl-PL")} zł</TableCell>
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
              </CardContent>
            </Card>

            {/* Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Pojazdy klienta ({client.activeVehicles})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nr rejestracyjny</TableHead>
                      <TableHead>Marka/Model</TableHead>
                      <TableHead>Rok produkcji</TableHead>
                      <TableHead>Pojemność</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">WA12345</TableCell>
                      <TableCell>VOLKSWAGEN PASSAT</TableCell>
                      <TableCell>2020</TableCell>
                      <TableCell>2000 cm³</TableCell>
                      <TableCell>WVW123456789</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">WA67890</TableCell>
                      <TableCell>FORD FOCUS</TableCell>
                      <TableCell>2019</TableCell>
                      <TableCell>1600 cm³</TableCell>
                      <TableCell>WF0123456789</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
