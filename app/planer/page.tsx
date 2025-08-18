"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, AlertCircle, CheckCircle, Plus, Search } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "overdue"
  assignedTo: string
  dueDate: string
  createdDate: string
  category: string
  client?: string
  policyNumber?: string
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Kontakt z klientem - wznowienie polisy",
    description: "Skontaktować się z Mariolą Nowak w sprawie wznowienia polisy komunikacyjnej",
    priority: "high",
    status: "pending",
    assignedTo: "Michał Jasiński",
    dueDate: "2024-01-20",
    createdDate: "2024-01-15",
    category: "Wznowienia",
    client: "Mariola Nowak",
    policyNumber: "58062014354",
  },
  {
    id: "2",
    title: "Przygotowanie oferty dla nowego klienta",
    description: "Przygotować ofertę ubezpieczenia komunikacyjnego dla Franciszka Wróblewskiego",
    priority: "medium",
    status: "in-progress",
    assignedTo: "Anna Kowalska",
    dueDate: "2024-01-22",
    createdDate: "2024-01-16",
    category: "Oferty",
    client: "Franciszek Wróblewski",
  },
  {
    id: "3",
    title: "Weryfikacja dokumentów szkody",
    description: "Sprawdzić kompletność dokumentów dla szkody nr SK2024/001",
    priority: "urgent",
    status: "overdue",
    assignedTo: "Piotr Nowak",
    dueDate: "2024-01-18",
    createdDate: "2024-01-14",
    category: "Szkody",
  },
  {
    id: "4",
    title: "Aktualizacja danych klienta",
    description: "Zaktualizować dane kontaktowe dla Olgi Włodarczyk",
    priority: "low",
    status: "completed",
    assignedTo: "Michał Jasiński",
    dueDate: "2024-01-19",
    createdDate: "2024-01-17",
    category: "Administracja",
    client: "Olga Włodarczyk",
  },
]

const mockClients = [
  { id: "1", name: "Mariola Nowak", phone: "+48 123456789", email: "mariola@example.com" },
  { id: "2", name: "Franciszek Wróblewski", phone: "+48 987654321", email: "franciszek@example.com" },
  { id: "3", name: "Anna Mazurek", phone: "+48 555123456", email: "anna.mazurek@example.com" },
  { id: "4", name: "Piotr Mazurek", phone: "+48 666789123", email: "piotr.mazurek@example.com" },
]

const assignmentOptions = [
  { value: "stazysta_anna", label: "Stażysta - Anna" },
  { value: "stazysta_piotr", label: "Stażysta - Piotr" },
  { value: "agent_michal_jasinski", label: "Agent - Michał Jasiński" },
  { value: "agent_anna_kowalska", label: "Agent - Anna Kowalska" },
]

const taskTitleOptions = ["Kontakt z klientem", "Przedstawienie oferty", "Wznowienie"]

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
}

export default function PlanerPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignedTo: "",
    dueDate: "",
    category: "",
    client: "",
    policyNumber: "",
  })
  const [clientSearch, setClientSearch] = useState("")
  const [showClientSuggestions, setShowClientSuggestions] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const filteredClients = mockClients.filter((client) => client.name.toLowerCase().includes(clientSearch.toLowerCase()))

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
      category: "",
      client: "",
      policyNumber: "",
    })
    setClientSearch("")
    setSelectedClient(null)
    setIsNewTaskOpen(false)
  }

  const handleClientSelect = (client: any) => {
    setSelectedClient(client)
    setNewTask({ ...newTask, client: client.name })
    setClientSearch(client.name)
    setShowClientSuggestions(false)
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planer zadań</h1>
            <p className="text-gray-600">Zarządzaj zadaniami i terminami</p>
          </div>

          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nowe zadanie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Dodaj nowe zadanie</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tytuł zadania</Label>
                    <Select value={newTask.title} onValueChange={(value) => setNewTask({ ...newTask, title: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz tytuł zadania" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskTitleOptions.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Kategoria</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wznowienia">Wznowienia</SelectItem>
                        <SelectItem value="Oferty">Oferty</SelectItem>
                        <SelectItem value="Szkody">Szkody</SelectItem>
                        <SelectItem value="Administracja">Administracja</SelectItem>
                        <SelectItem value="Kontakt">Kontakt z klientem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Opis zadania</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Szczegółowy opis zadania"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Priorytet</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Niski</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="high">Wysoki</SelectItem>
                        <SelectItem value="urgent">Pilny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Przypisane do</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          assignedTo: assignmentOptions.find((opt) => opt.value === value)?.label || value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz osobę" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Termin wykonania</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Label htmlFor="client">Klient</Label>
                    <Input
                      id="client"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value)
                        setShowClientSuggestions(true)
                      }}
                      onFocus={() => setShowClientSuggestions(true)}
                      placeholder="Wpisz nazwisko klienta..."
                    />
                    {showClientSuggestions && clientSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleClientSelect(client)}
                          >
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-500">
                              {client.phone} • {client.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedClient && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <div>
                          <strong>Telefon:</strong> {selectedClient.phone}
                        </div>
                        <div>
                          <strong>Email:</strong> {selectedClient.email}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Nr polisy (opcjonalnie)</Label>
                    <Input
                      id="policyNumber"
                      value={newTask.policyNumber}
                      onChange={(e) => setNewTask({ ...newTask, policyNumber: e.target.value })}
                      placeholder="Numer polisy"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title || !newTask.dueDate}>
                  Dodaj zadanie
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wszystkie</p>
                  <p className="text-2xl font-bold">{taskStats.total}</p>
                </div>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Oczekujące</p>
                  <p className="text-2xl font-bold text-gray-700">{taskStats.pending}</p>
                </div>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">W trakcie</p>
                  <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ukończone</p>
                  <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Przeterminowane</p>
                  <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Szukaj zadań..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="in-progress">W trakcie</SelectItem>
                  <SelectItem value="completed">Ukończone</SelectItem>
                  <SelectItem value="overdue">Przeterminowane</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Priorytet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie priorytety</SelectItem>
                  <SelectItem value="low">Niski</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="high">Wysoki</SelectItem>
                  <SelectItem value="urgent">Pilny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority === "low" && "Niski"}
                        {task.priority === "medium" && "Średni"}
                        {task.priority === "high" && "Wysoki"}
                        {task.priority === "urgent" && "Pilny"}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status === "pending" && "Oczekujące"}
                        {task.status === "in-progress" && "W trakcie"}
                        {task.status === "completed" && "Ukończone"}
                        {task.status === "overdue" && "Przeterminowane"}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{task.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {task.assignedTo}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Termin: {task.dueDate}
                      </div>
                      {task.client && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Klient: {task.client}
                        </div>
                      )}
                      {task.policyNumber && <div className="flex items-center gap-1">Polisa: {task.policyNumber}</div>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {task.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "in-progress")}>
                        Rozpocznij
                      </Button>
                    )}
                    {task.status === "in-progress" && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(task.id, "completed")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Zakończ
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "pending")}>
                        Przywróć
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak zadań</h3>
              <p className="text-gray-600">Nie znaleziono zadań spełniających kryteria wyszukiwania.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
