"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building, Calendar, Mail, Phone, FileText, Edit } from "lucide-react"

interface NewClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (clientData: any) => void
  initialData?: any
  mode?: "create" | "edit"
}

export function NewClientForm({ open, onOpenChange, onSubmit, initialData, mode = "create" }: NewClientFormProps) {
  const [clientType, setClientType] = useState<"individual" | "company">("individual")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    pesel: "",
    nip: "",
    regon: "",
    address: "",
    notes: "",
    birthDate: "",
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const nameParts = initialData.name?.split(" ") || ["", ""]
      setClientType(initialData.type || "individual")
      setFormData({
        firstName: initialData.type === "individual" ? nameParts[0] || "" : "",
        lastName: initialData.type === "individual" ? nameParts.slice(1).join(" ") || "" : "",
        companyName: initialData.type === "company" ? initialData.name || "" : "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        pesel: initialData.pesel || "",
        nip: initialData.nip || "",
        regon: initialData.regon || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
        birthDate: initialData.birthDate || "",
      })
    } else {
      // Reset form for create mode
      setClientType("individual")
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        pesel: "",
        nip: "",
        regon: "",
        address: "",
        notes: "",
        birthDate: "",
      })
    }
  }, [mode, initialData, open])

  const decodePesel = (pesel: string) => {
    if (pesel.length !== 11) return ""

    const year = Number.parseInt(pesel.substring(0, 2))
    const month = Number.parseInt(pesel.substring(2, 4))
    const day = Number.parseInt(pesel.substring(4, 6))

    // Determine century based on month encoding
    let fullYear = year
    if (month >= 1 && month <= 12) {
      fullYear = 1900 + year
    } else if (month >= 21 && month <= 32) {
      fullYear = 2000 + year
    } else if (month >= 41 && month <= 52) {
      fullYear = 2100 + year
    } else if (month >= 61 && month <= 72) {
      fullYear = 2200 + year
    } else if (month >= 81 && month <= 92) {
      fullYear = 1800 + year
    }

    const actualMonth =
      month > 20 ? month - 20 : month > 40 ? month - 40 : month > 60 ? month - 60 : month > 80 ? month - 80 : month

    return `${fullYear}-${actualMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  const handlePeselChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      pesel: value,
      birthDate: decodePesel(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const clientData = {
      id: mode === "edit" && initialData ? initialData.id : Date.now().toString(),
      name: clientType === "individual" ? `${formData.firstName} ${formData.lastName}` : formData.companyName,
      type: clientType,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      pesel: clientType === "individual" ? formData.pesel : undefined,
      nip: clientType === "company" ? formData.nip : undefined,
      regon: clientType === "company" ? formData.regon : undefined,
      birthDate: formData.birthDate,
      notes: formData.notes,
      policies: mode === "edit" && initialData ? initialData.policies : [],
      totalPolicies: mode === "edit" && initialData ? initialData.totalPolicies : 0,
      activeVehicles: mode === "edit" && initialData ? initialData.activeVehicles : 0,
      totalPremium: mode === "edit" && initialData ? initialData.totalPremium : 0,
      lastContact: mode === "edit" && initialData ? initialData.lastContact : new Date().toISOString().split("T")[0],
      status: mode === "edit" && initialData ? initialData.status : ("prospect" as const),
    }

    onSubmit(clientData)

    // Reset form only in create mode
    if (mode === "create") {
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        pesel: "",
        nip: "",
        regon: "",
        address: "",
        notes: "",
        birthDate: "",
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "edit" ? <Edit className="w-5 h-5" /> : <User className="w-5 h-5" />}
            {mode === "edit" ? "Edytuj klienta" : "Nowy klient"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Type Selection */}
          <div className="space-y-2">
            <Label>Typ klienta</Label>
            <Select value={clientType} onValueChange={(value: "individual" | "company") => setClientType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Osoba fizyczna
                  </div>
                </SelectItem>
                <SelectItem value="company">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Firma
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Individual Client Fields */}
          {clientType === "individual" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesel">PESEL *</Label>
                <Input
                  id="pesel"
                  value={formData.pesel}
                  onChange={(e) => handlePeselChange(e.target.value)}
                  placeholder="11 cyfr PESEL"
                  maxLength={11}
                  required
                />
                {formData.birthDate && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Calendar className="w-4 h-4" />
                    Data urodzenia: {formData.birthDate}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Company Client Fields */}
          {clientType === "company" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Nazwa firmy *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={formData.nip}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nip: e.target.value }))}
                    placeholder="10 cyfr NIP"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regon">REGON</Label>
                  <Input
                    id="regon"
                    value={formData.regon}
                    onChange={(e) => setFormData((prev) => ({ ...prev, regon: e.target.value }))}
                    placeholder="9 lub 14 cyfr REGON"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numer telefonu *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="pl-10"
                placeholder="+48 123 456 789"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="ul. Przykładowa 123, 00-001 Warszawa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Uwagi</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="pl-10 min-h-[100px]"
                placeholder="Dodatkowe informacje o kliencie..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {mode === "edit" ? "Zapisz zmiany" : "Zapisz klienta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
