"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Car, Save, X, Check, FileText, User, MapPin } from "lucide-react"

interface PolicyFormProps {
  policyId?: string | null
  onBack: () => void
}

export function PolicyForm({ policyId, onBack }: PolicyFormProps) {
  const [formData, setFormData] = useState({
    company: "Warta",
    product: "Komunikacyjne",
    policyNumber: "920007406580",
    issueDate: "2021-07-14",
    policyType: "Wznowienie",
    endPolicyNumber: "085604700029",
    protectionStart: "2021-07-16",
    protectionEnd: "2022-07-15",
    registrationMode: "eAgent",
    policyContainsRemoteService: true,
    premium: "1060.40",
    firstInstallment: "268.44",
    installmentCount: "4",
    paymentMode: "On-line",
    roDoEmailRenewals: true,
    roDoSmsRenewals: true,
    roDoEmailOwuPid: true,
    roDoEmailNotifications: true,
    roDoPhoneCalls: true,
    roDoSmsNotifications: true,
    roDoPostalMailing: false,
  })

  const installments = [
    {
      id: 1,
      type: "edit",
      dueDate: "2021-07-28",
      amount: "268.44",
      paid: true,
      paidDate: "2021-06-26",
      paidAmount: "181.00",
    },
    { id: 2, type: "edit", dueDate: "2021-10-15", amount: "263.99", paid: false, paidDate: "-", paidAmount: "-" },
    { id: 3, type: "edit", dueDate: "2022-01-14", amount: "263.99", paid: false, paidDate: "-", paidAmount: "-" },
    { id: 4, type: "edit", dueDate: "2022-04-14", amount: "263.99", paid: false, paidDate: "-", paidAmount: "-" },
  ]

  const clients = [
    {
      name: "Marian Kozłowski",
      address: "11-062 Wysokie Mazowieckie, Bekasów 11 m. 54",
      role: "Ubezpieczający",
      isInsured: true,
      isUser: false,
      isContactPerson: true,
    },
    {
      name: "Klara Włodarczyk",
      address: "63-338 Baranów, Kotylion 54 m. 68",
      role: "Ubezpieczony",
      isInsured: false,
      isUser: true,
      isContactPerson: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {policyId ? "Edycja polisy" : "Nowa polisa"} - {formData.policyNumber}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Policy Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Policy Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dane podstawowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Firma</Label>
                  <Select
                    value={formData.company}
                    onValueChange={(value) => setFormData({ ...formData, company: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Warta">Warta</SelectItem>
                      <SelectItem value="PZU">PZU</SelectItem>
                      <SelectItem value="Allianz">Allianz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="product">Produkt</Label>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => setFormData({ ...formData, product: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Komunikacyjne">Komunikacyjne</SelectItem>
                      <SelectItem value="Majątkowe">Majątkowe</SelectItem>
                      <SelectItem value="Życiowe">Życiowe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyNumber">Nr polisy</Label>
                  <Input
                    id="policyNumber"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="issueDate">Data wyst.</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyType">Rodzaj polisy</Label>
                  <Select
                    value={formData.policyType}
                    onValueChange={(value) => setFormData({ ...formData, policyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wznowienie">Wznowienie</SelectItem>
                      <SelectItem value="Nowa">Nowa</SelectItem>
                      <SelectItem value="Aneks">Aneks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endPolicyNumber">do polisy</Label>
                  <Input
                    id="endPolicyNumber"
                    value={formData.endPolicyNumber}
                    onChange={(e) => setFormData({ ...formData, endPolicyNumber: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protection Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Daty ochrony</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protectionStart">od dnia</Label>
                  <Input
                    id="protectionStart"
                    type="date"
                    value={formData.protectionStart}
                    onChange={(e) => setFormData({ ...formData, protectionStart: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="protectionEnd">do dnia</Label>
                  <Input
                    id="protectionEnd"
                    type="date"
                    value={formData.protectionEnd}
                    onChange={(e) => setFormData({ ...formData, protectionEnd: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium and Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Składka za polisę (przypis)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premium">Składka</Label>
                  <Input
                    id="premium"
                    value={formData.premium}
                    onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="firstInstallment">Inkaso (1 rata)</Label>
                  <Input
                    id="firstInstallment"
                    value={formData.firstInstallment}
                    onChange={(e) => setFormData({ ...formData, firstInstallment: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="installmentCount">Liczba rat</Label>
                  <Input
                    id="installmentCount"
                    value={formData.installmentCount}
                    onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMode">Płatność</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-line">On-line</SelectItem>
                      <SelectItem value="Przelew">Przelew</SelectItem>
                      <SelectItem value="Gotówka">Gotówka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Installment Schedule */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox id="dowolnie" checked={true} readOnly />
                  <Label htmlFor="dowolnie">dowolnie</Label>
                  <span className="ml-auto text-sm text-gray-600">Lista ratsplat</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nr raty</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Data wymagalności (raty)</TableHead>
                      <TableHead>Kwota</TableHead>
                      <TableHead>Spłata</TableHead>
                      <TableHead>data</TableHead>
                      <TableHead>kwota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell>{installment.id}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{installment.dueDate}</TableCell>
                        <TableCell>{installment.amount} zł</TableCell>
                        <TableCell>
                          {installment.paid ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>{installment.paidDate}</TableCell>
                        <TableCell>{installment.paidAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* RODO Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Zgody RODO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">obsługa umowy:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoEmailRenewals"
                        checked={formData.roDoEmailRenewals}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoEmailRenewals: !!checked })}
                      />
                      <Label htmlFor="roDoEmailRenewals">wznowienia przez e-mail</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoSmsRenewals"
                        checked={formData.roDoSmsRenewals}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoSmsRenewals: !!checked })}
                      />
                      <Label htmlFor="roDoSmsRenewals">wznowienia przez SMS</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoEmailOwuPid"
                        checked={formData.roDoEmailOwuPid}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoEmailOwuPid: !!checked })}
                      />
                      <Label htmlFor="roDoEmailOwuPid">OWU/PID przez e-mail</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">zgody marketingowe:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoEmailNotifications"
                        checked={formData.roDoEmailNotifications}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoEmailNotifications: !!checked })}
                      />
                      <Label htmlFor="roDoEmailNotifications">wiadomości e-mail</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoSmsNotifications"
                        checked={formData.roDoSmsNotifications}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoSmsNotifications: !!checked })}
                      />
                      <Label htmlFor="roDoSmsNotifications">wiadomości SMS</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoPhoneCalls"
                        checked={formData.roDoPhoneCalls}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoPhoneCalls: !!checked })}
                      />
                      <Label htmlFor="roDoPhoneCalls">połączenia telefoniczne</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roDoPostalMailing"
                        checked={formData.roDoPostalMailing}
                        onCheckedChange={(checked) => setFormData({ ...formData, roDoPostalMailing: !!checked })}
                      />
                      <Label htmlFor="roDoPostalMailing">mailing pocztowy</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={onBack} variant="outline" className="bg-red-500 text-white hover:bg-red-600">
              <X className="w-4 h-4 mr-2" />
              Zamknij
            </Button>
            <div className="flex-1 text-center">
              <Badge className="bg-green-100 text-green-800">Walidacje OK!</Badge>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Zapisz
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Vehicle and Client Info */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                D114507
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>Marka:</strong> VOLKSWAGEN
              </div>
              <div>
                <strong>Typ/model:</strong> PASSAT
              </div>
              <div>
                <strong>Rodzaj:</strong> Osobowy
              </div>
              <div>
                <strong>Rok prod.:</strong> 2000
              </div>
              <div>
                <strong>Data 1 rej.:</strong> 2000-06-01
              </div>
              <div>
                <strong>Pojemność:</strong> 2411 ccm
              </div>
              <div>
                <strong>Ładowność:</strong> 623 kg
              </div>
              <div>
                <strong>DMC:</strong> 623 kg
              </div>
              <div>
                <strong>VIN:</strong> 65Y5VN3F24X416276
              </div>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Podmioty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clients.map((client, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <strong className="text-sm">{client.name}</strong>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {client.address}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs">
                      <strong>Role:</strong>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Checkbox checked={client.isInsured} readOnly />
                      <span>Ubezpieczający</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Checkbox checked={client.isUser} readOnly />
                      <span>Ubezpieczony</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Checkbox checked={false} readOnly />
                      <span>Użytkownik</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Checkbox checked={client.isContactPerson} readOnly />
                      <span>Kontakt umowa</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
