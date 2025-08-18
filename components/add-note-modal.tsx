"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, User, Building } from "lucide-react"

interface Client {
  id: string
  name: string
  type: "individual" | "company"
  email: string
  phone: string
}

interface AddNoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  onSubmit: (note: any) => void
}

export function AddNoteModal({ open, onOpenChange, client, onSubmit }: AddNoteModalProps) {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "medium",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const note = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category,
      priority: noteData.priority,
      createdAt: new Date().toISOString(),
      createdBy: "Michał Jasiński", // Current user
    }

    onSubmit(note)

    // Reset form
    setNoteData({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
    })
  }

  const handleCancel = () => {
    setNoteData({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Dodaj uwagę dla klienta
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tytuł uwagi</Label>
              <Input
                id="title"
                value={noteData.title}
                onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                placeholder="Wprowadź tytuł uwagi..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <Select
                value={noteData.category}
                onValueChange={(value) => setNoteData({ ...noteData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Ogólne</SelectItem>
                  <SelectItem value="contact">Kontakt</SelectItem>
                  <SelectItem value="policy">Polisa</SelectItem>
                  <SelectItem value="claim">Szkoda</SelectItem>
                  <SelectItem value="payment">Płatność</SelectItem>
                  <SelectItem value="renewal">Wznowienie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorytet</Label>
            <Select value={noteData.priority} onValueChange={(value) => setNoteData({ ...noteData, priority: value })}>
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
            <Label htmlFor="content">Treść uwagi</Label>
            <Textarea
              id="content"
              value={noteData.content}
              onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
              placeholder="Wprowadź szczegóły uwagi..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Zapisz uwagę
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
