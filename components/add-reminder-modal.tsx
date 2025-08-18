"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Building, Clock } from "lucide-react"

interface Client {
  id: string
  name: string
  type: "individual" | "company"
  email: string
  phone: string
}

interface AddReminderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  onSubmit: (reminder: any) => void
}

export function AddReminderModal({ open, onOpenChange, client, onSubmit }: AddReminderModalProps) {
  const [reminderData, setReminderData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    category: "general",
    assignedTo: "Michał Jasiński",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const reminder = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      title: reminderData.title,
      description: reminderData.description,
      dueDate: reminderData.dueDate,
      dueTime: reminderData.dueTime,
      priority: reminderData.priority,
      category: reminderData.category,
      assignedTo: reminderData.assignedTo,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: "Michał Jasiński",
    }

    onSubmit(reminder)

    // Reset form
    setReminderData({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      category: "general",
      assignedTo: "Michał Jasiński",
    })
  }

  const handleCancel = () => {
    setReminderData({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      category: "general",
      assignedTo: "Michał Jasiński",
    })
    onOpenChange(false)
  }

  // Get tomorrow's date as default
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowString = tomorrow.toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Dodaj przypomnienie do planera zadań
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {client.type === "individual" ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
            <span className="font-medium">{client.name}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {client.email} • {client.phone}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł zadania</Label>
            <Input
              id="title"
              value={reminderData.title}
              onChange={(e) => setReminderData({ ...reminderData, title: e.target.value })}
              placeholder="np. Kontakt z klientem w sprawie wznowienia polisy"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data wykonania</Label>
              <Input
                id="dueDate"
                type="date"
                value={reminderData.dueDate || tomorrowString}
                onChange={(e) => setReminderData({ ...reminderData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Godzina</Label>
              <Input
                id="dueTime"
                type="time"
                value={reminderData.dueTime}
                onChange={(e) => setReminderData({ ...reminderData, dueTime: e.target.value })}
                placeholder="09:00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorytet</Label>
              <Select
                value={reminderData.priority}
                onValueChange={(value) => setReminderData({ ...reminderData, priority: value })}
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

            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <Select
                value={reminderData.category}
                onValueChange={(value) => setReminderData({ ...reminderData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Ogólne</SelectItem>
                  <SelectItem value="contact">Kontakt z klientem</SelectItem>
                  <SelectItem value="policy">Polisa</SelectItem>
                  <SelectItem value="renewal">Wznowienie</SelectItem>
                  <SelectItem value="claim">Szkoda</SelectItem>
                  <SelectItem value="payment">Płatność</SelectItem>
                  <SelectItem value="meeting">Spotkanie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Przypisane do</Label>
            <Select
              value={reminderData.assignedTo}
              onValueChange={(value) => setReminderData({ ...reminderData, assignedTo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Michał Jasiński">Michał Jasiński (Agent)</SelectItem>
                <SelectItem value="Anna Kowalska">Anna Kowalska (Agent)</SelectItem>
                <SelectItem value="Piotr Nowak">Piotr Nowak (Stażysta)</SelectItem>
                <SelectItem value="Katarzyna Wiśniewska">Katarzyna Wiśniewska (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis zadania</Label>
            <Textarea
              id="description"
              value={reminderData.description}
              onChange={(e) => setReminderData({ ...reminderData, description: e.target.value })}
              placeholder="Szczegółowy opis zadania, uwagi, informacje dodatkowe..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Clock className="w-4 h-4 mr-2" />
              Dodaj przypomnienie
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
