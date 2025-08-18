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
import { ArrowLeft, Upload, RefreshCw, Car } from "lucide-react"

interface PolicyImportProps {
  onBack: () => void
}

const mockImportPolicies = [
  {
    id: "1",
    number: "909009090055",
    status: "Zawieszona",
    product: "nMFkom",
    client: "MARIA",
    issueDate: "2021-07-07",
    selected: true,
  },
  {
    id: "2",
    number: "909009090059",
    status: "Zawieszona",
    product: "E1kom",
    client: "MICHAŁ",
    issueDate: "2021-07-07",
    selected: true,
  },
  {
    id: "3",
    number: "909009090004",
    status: "Zawieszona",
    product: "nE7kom",
    client: "JÓZEF",
    issueDate: "2021-07-07",
    selected: true,
  },
  {
    id: "4",
    number: "909009090090",
    status: "Zawieszona",
    product: "E1kom",
    client: "LECH",
    issueDate: "2021-07-07",
    selected: true,
  },
  {
    id: "5",
    number: "909009090098",
    status: "Zawieszona",
    product: "nE7kom",
    client: "MIROSŁAWA",
    issueDate: "2021-07-07",
    selected: true,
  },
]

export function PolicyImport({ onBack }: PolicyImportProps) {
  const [importMode, setImportMode] = useState<"period" | "specific">("period")
  const [dateFrom, setDateFrom] = useState("2021-07-07")
  const [dateTo, setDateTo] = useState("2021-07-07")
  const [sortBy, setSortBy] = useState("od najnowszej polisy")
  const [source, setSource] = useState("iHestia")
  const [policies, setPolicies] = useState(mockImportPolicies)
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setPolicies(policies.map((policy) => ({ ...policy, selected: checked })))
  }

  const handleSelectPolicy = (policyId: string, checked: boolean) => {
    setPolicies(policies.map((policy) => (policy.id === policyId ? { ...policy, selected: checked } : policy)))
  }

  const selectedCount = policies.filter((p) => p.selected).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Import polis z aplikacji [iHestia]...</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Wybierz sposób importu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import Mode Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="period"
                name="importMode"
                checked={importMode === "period"}
                onChange={() => setImportMode("period")}
              />
              <Label htmlFor="period">Pobierz polisy we wskazanym okresie</Label>
            </div>

            {importMode === "period" && (
              <div className="ml-6 grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="dateFrom">od dnia:</Label>
                  <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dateTo">do dnia:</Label>
                  <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sortBy">Sortuj:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="od najnowszej polisy">od najnowszej polisy</SelectItem>
                      <SelectItem value="od najstarszej polisy">od najstarszej polisy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="specific"
                name="importMode"
                checked={importMode === "specific"}
                onChange={() => setImportMode("specific")}
              />
              <Label htmlFor="specific">Pobierz konkretną polisę</Label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Zmień kryteria importu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista polis we wskazanych kryteriach</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="selectAll" checked={selectAll} onCheckedChange={handleSelectAll} />
                <Label htmlFor="selectAll">Pomiń polisy, które już są w Twojej bazie Agent21</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="skipExisting" checked={false} readOnly />
                <Label htmlFor="skipExisting">Pomiń anulowane</Label>
              </div>
              <div className="text-sm text-gray-600">
                Źródło:{" "}
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iHestia">iHestia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gray-600 hover:bg-gray-700">
                <Upload className="w-4 h-4 mr-2" />
                Importuj polisy ({selectedCount})
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>Nr polisy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Data wyst.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <Checkbox
                      checked={policy.selected}
                      onCheckedChange={(checked) => handleSelectPolicy(policy.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{policy.number}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      {policy.product}
                    </div>
                  </TableCell>
                  <TableCell>{policy.client}</TableCell>
                  <TableCell>{policy.issueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
