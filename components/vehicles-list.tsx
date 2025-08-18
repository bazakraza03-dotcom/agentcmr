"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Car, Edit, Plus, Filter, RefreshCw, FileText, X, Loader2 } from "lucide-react"

interface Vehicle {
  id: string
  registrationNumber: string
  make: string
  model: string
  type: "Osobowy" | "Ciężarowy" | "Motorower" | "Przyczepa"
  productionYear: number
  engineCapacity: number
  enginePower: number
  weight: number
  vin: string
  owner: string
  status: "active" | "inactive" | "sold"
  firstRegistrationDate?: string
  createdBy?: string
  createdAt?: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "GR3806Q",
    make: "PEUGEOT",
    model: "508",
    type: "Osobowy",
    productionYear: 2001,
    engineCapacity: 0,
    enginePower: 0,
    weight: 0,
    vin: "SW8184CN4MD206708",
    owner: "Hanna Wiśniewska",
    status: "active",
  },
  {
    id: "2",
    registrationNumber: "QY87517",
    make: "FORD",
    model: "KUGA",
    type: "Osobowy",
    productionYear: 2020,
    engineCapacity: 3089,
    enginePower: 149,
    weight: 645,
    vin: "E63N93073GF62284",
    owner: "Igor Tomaszewski",
    status: "active",
  },
  {
    id: "3",
    registrationNumber: "CF3309S",
    make: "MAZDA",
    model: "3",
    type: "Osobowy",
    productionYear: 2013,
    engineCapacity: 3251,
    enginePower: 212,
    weight: 425,
    vin: "X4L666888113B0476",
    owner: "Witold Malinowski, Adrian Tomaszewski",
    status: "active",
  },
  {
    id: "4",
    registrationNumber: "PO01108",
    make: "INFINITI",
    model: "Q50",
    type: "Osobowy",
    productionYear: 2020,
    engineCapacity: 4478,
    enginePower: 252,
    weight: 0,
    vin: "8A72K0640L3277278",
    owner: "Kazimierz Duda",
    status: "active",
  },
  {
    id: "5",
    registrationNumber: "5G014AL",
    make: "TOYOTA (USA)",
    model: "SIENNA",
    type: "Osobowy",
    productionYear: 2020,
    engineCapacity: 4476,
    enginePower: 225,
    weight: 0,
    vin: "1208521134P873103",
    owner: "Dagmara Malinowska",
    status: "active",
  },
  {
    id: "6",
    registrationNumber: "00612485",
    make: "HYUNDAI",
    model: "TUCSON",
    type: "Osobowy",
    productionYear: 2020,
    engineCapacity: 2961,
    enginePower: 181,
    weight: 615,
    vin: "C5ZL7804RIM040616",
    owner: "Piotr Tomaszewski",
    status: "active",
  },
  {
    id: "7",
    registrationNumber: "U961620",
    make: "INTRALL",
    model: "LUBLIN",
    type: "Ciężarowy",
    productionYear: 2016,
    engineCapacity: 3674,
    enginePower: 90,
    weight: 990,
    vin: "JYY758024005434488",
    owner: "Barbara Kucharska",
    status: "active",
  },
  {
    id: "8",
    registrationNumber: "Q33183Y",
    make: "SKODA",
    model: "SUPERB",
    type: "Osobowy",
    productionYear: 2020,
    engineCapacity: 2640,
    enginePower: 159,
    weight: 510,
    vin: "Q6C5N67P306833467",
    owner: "Aleksander Wiśniewski",
    status: "active",
  },
]

export function VehiclesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [makeFilter, setMakeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false)
  const [showVehicleDetails, setShowVehicleDetails] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [newVehicleData, setNewVehicleData] = useState({
    vin: "",
    registrationNumber: "",
    firstRegistrationDate: "",
  })
  const [isLoadingVehicleData, setIsLoadingVehicleData] = useState(false)
  const [fetchedVehicleData, setFetchedVehicleData] = useState<Partial<Vehicle> | null>(null)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || vehicle.type === typeFilter
    const matchesMake = makeFilter === "all" || vehicle.make === makeFilter
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesType && matchesMake && matchesStatus
  })

  const handleNewVehicle = () => {
    setShowNewVehicleForm(true)
    setNewVehicleData({ vin: "", registrationNumber: "", firstRegistrationDate: "" })
    setFetchedVehicleData(null)
  }

  const fetchVehicleDataFromGov = async () => {
    if (!newVehicleData.vin || !newVehicleData.registrationNumber || !newVehicleData.firstRegistrationDate) {
      alert("Proszę wypełnić wszystkie wymagane pola: VIN, numer rejestracyjny i datę pierwszej rejestracji")
      return
    }

    setIsLoadingVehicleData(true)
    console.log("[v0] Fetching vehicle data from gov.pl with:", newVehicleData)

    try {
      const govUrl = `https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=HistoriaPojazdu#/search`
      window.open(govUrl, "_blank", "width=1200,height=800")

      setTimeout(() => {
        const simulatedData = {
          make: "VOLKSWAGEN",
          model: "GOLF",
          type: "Osobowy" as const,
          productionYear: 2018,
          engineCapacity: 1598,
          enginePower: 85,
          weight: 1320,
          owner: "Jan Kowalski",
        }

        setFetchedVehicleData(simulatedData)
        setIsLoadingVehicleData(false)
        console.log("[v0] Vehicle data fetched:", simulatedData)
      }, 2000)
    } catch (error) {
      console.error("[v0] Error fetching vehicle data:", error)
      setIsLoadingVehicleData(false)
      alert("Błąd podczas pobierania danych pojazdu. Spróbuj ponownie.")
    }
  }

  const handleSaveNewVehicle = () => {
    if (!fetchedVehicleData) {
      alert("Najpierw pobierz dane pojazdu z systemu gov.pl")
      return
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      registrationNumber: newVehicleData.registrationNumber,
      vin: newVehicleData.vin,
      firstRegistrationDate: newVehicleData.firstRegistrationDate,
      make: fetchedVehicleData.make || "",
      model: fetchedVehicleData.model || "",
      type: fetchedVehicleData.type || "Osobowy",
      productionYear: fetchedVehicleData.productionYear || new Date().getFullYear(),
      engineCapacity: fetchedVehicleData.engineCapacity || 0,
      enginePower: fetchedVehicleData.enginePower || 0,
      weight: fetchedVehicleData.weight || 0,
      owner: fetchedVehicleData.owner || "",
      status: "active",
      createdBy: "admin@firma.pl",
      createdAt: new Date().toISOString(),
    }

    setVehicles((prev) => [newVehicle, ...prev])
    setShowNewVehicleForm(false)
    console.log("[v0] New vehicle added:", newVehicle)
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetails(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    console.log("[v0] Editing vehicle:", vehicle.registrationNumber)
    // Open edit form
  }

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    if (confirm(`Czy na pewno chcesz usunąć pojazd ${vehicle.registrationNumber}?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id))
      console.log("[v0] Vehicle deleted:", vehicle.registrationNumber)
    }
  }

  const getVehicleTypeIcon = (type: string) => {
    return <Car className="w-4 h-4 text-gray-600" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Nieaktywny</Badge>
      case "sold":
        return <Badge className="bg-red-100 text-red-800">Sprzedany</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Pojazdy
          </CardTitle>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewVehicle}>
                <Plus className="w-4 h-4 mr-2" />
                Nowy
              </Button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nr rej/ Nr VIN/ Nazwisko/ PESEL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline">
                <Filter className="w-4 h-4" />
              </Button>

              <Button variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span>Filtruj według:</span>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="[rodzaj pojazdu]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="Osobowy">Osobowy</SelectItem>
                  <SelectItem value="Ciężarowy">Ciężarowy</SelectItem>
                  <SelectItem value="Motorower">Motorower</SelectItem>
                  <SelectItem value="Przyczepa">Przyczepa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={makeFilter} onValueChange={setMakeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="[marka pojazdu]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie marki</SelectItem>
                  {uniqueMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[status]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="active">Aktywne</SelectItem>
                  <SelectItem value="inactive">Nieaktywne</SelectItem>
                  <SelectItem value="sold">Sprzedane</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[zadania]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="completed">Zakończone</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="[szkodowość]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="with">Ze szkodami</SelectItem>
                  <SelectItem value="without">Bez szkód</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>akcje</TableHead>
                <TableHead>Nr rej</TableHead>
                <TableHead>Podgląd</TableHead>
                <TableHead>Marka/ typ/ model</TableHead>
                <TableHead>Rodzaj</TableHead>
                <TableHead>Rok prod.</TableHead>
                <TableHead>Pojemność (moc) ładowność (DMC)</TableHead>
                <TableHead>VIN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditVehicle(vehicle)}
                        title="Edytuj pojazd"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleViewVehicle(vehicle)}
                        title="Podgląd pojazdu"
                      >
                        <Search className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Dokumenty pojazdu">
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteVehicle(vehicle)}
                        title="Usuń pojazd"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{vehicle.registrationNumber}</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">0</Badge>
                      <Badge className="bg-gray-100 text-gray-800 text-xs">0</Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        <strong>{vehicle.make}</strong> {vehicle.model}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{vehicle.type}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{vehicle.productionYear}</div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {vehicle.engineCapacity > 0 && (
                        <div>
                          <strong>{vehicle.engineCapacity}</strong> cm3 ({vehicle.enginePower} kW)
                        </div>
                      )}
                      {vehicle.weight > 0 && (
                        <div>
                          <strong>{vehicle.weight}</strong> kg
                        </div>
                      )}
                      {vehicle.engineCapacity === 0 && vehicle.weight === 0 && (
                        <div className="text-gray-400">Brak danych</div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{vehicle.vin}</div>
                      <div className="text-xs text-gray-600">{vehicle.owner}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Wyświetlane pojazdy: {filteredVehicles.length} z {vehicles.length} (bez limitu)
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Wszystkie pojazdy wyświetlone</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNewVehicleForm} onOpenChange={setShowNewVehicleForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">Numer VIN *</Label>
                <Input
                  id="vin"
                  value={newVehicleData.vin}
                  onChange={(e) => setNewVehicleData((prev) => ({ ...prev, vin: e.target.value }))}
                  placeholder="Wprowadź numer VIN"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Numer rejestracyjny *</Label>
                <Input
                  id="registrationNumber"
                  value={newVehicleData.registrationNumber}
                  onChange={(e) => setNewVehicleData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                  placeholder="Wprowadź numer rejestracyjny"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstRegistrationDate">Data pierwszej rejestracji *</Label>
              <Input
                id="firstRegistrationDate"
                type="date"
                value={newVehicleData.firstRegistrationDate}
                onChange={(e) => setNewVehicleData((prev) => ({ ...prev, firstRegistrationDate: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={fetchVehicleDataFromGov}
                disabled={isLoadingVehicleData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoadingVehicleData ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Pobieranie danych...
                  </>
                ) : (
                  "Pobierz dane z gov.pl"
                )}
              </Button>

              {fetchedVehicleData && <Badge className="bg-green-100 text-green-800">Dane pobrane pomyślnie</Badge>}
            </div>

            {fetchedVehicleData && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Pobrane dane pojazdu:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Marka:</strong> {fetchedVehicleData.make}
                  </div>
                  <div>
                    <strong>Model:</strong> {fetchedVehicleData.model}
                  </div>
                  <div>
                    <strong>Typ:</strong> {fetchedVehicleData.type}
                  </div>
                  <div>
                    <strong>Rok produkcji:</strong> {fetchedVehicleData.productionYear}
                  </div>
                  <div>
                    <strong>Pojemność:</strong> {fetchedVehicleData.engineCapacity} cm³
                  </div>
                  <div>
                    <strong>Moc:</strong> {fetchedVehicleData.enginePower} kW
                  </div>
                  <div>
                    <strong>Masa:</strong> {fetchedVehicleData.weight} kg
                  </div>
                  <div>
                    <strong>Właściciel:</strong> {fetchedVehicleData.owner}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewVehicleForm(false)}>
              Anuluj
            </Button>
            <Button
              onClick={handleSaveNewVehicle}
              disabled={!fetchedVehicleData}
              className="bg-green-600 hover:bg-green-700"
            >
              Zapisz pojazd
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
