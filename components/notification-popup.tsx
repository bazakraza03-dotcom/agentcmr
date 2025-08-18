"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Phone, Mail, Clock } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "reminder" | "alert"
  timestamp: string
  contact?: string
  assignee?: string
  phone?: string
  email?: string
  completedAt?: string
  shouldReappear?: boolean
}

interface NotificationPopupProps {
  notification: Notification
  onClose: () => void
  onComplete: () => void
  onRemind?: (minutes: number) => void
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Przypomnienie o zaplanowanym zadaniu",
      message: "Kontakt z klientem",
      type: "reminder",
      timestamp: "2021-07-19 10:00",
      contact: "Przemysław Kozłowski",
      assignee: "Michał Jasiński",
      phone: "+48 123456789",
      email: "przemyslaw@example.com",
      shouldReappear: false, // Changed to false so completed tasks don't reappear
    },
  ])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const completeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    console.log("[v0] Task completed and removed permanently:", id)
  }

  const remindLater = (id: string, minutes: number) => {
    const notification = notifications.find((n) => n.id === id)
    if (notification) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))

      setTimeout(
        () => {
          setNotifications((prev) => [
            ...prev,
            {
              ...notification,
              id: id + "_remind_" + Date.now(),
              timestamp: new Date().toLocaleString(),
              title: `Przypomnienie: ${notification.title}`,
            },
          ])
        },
        minutes * 60 * 1000,
      )

      console.log(`[v0] Task reminder set for ${minutes} minutes:`, id)
    }
  }

  return {
    notifications,
    removeNotification,
    completeNotification,
    remindLater,
  }
}

export function NotificationPopup({ notification, onClose, onComplete, onRemind }: NotificationPopupProps) {
  const [showRemindOptions, setShowRemindOptions] = useState(false)

  const handleRemind = (minutes: number) => {
    if (onRemind) {
      onRemind(minutes)
    }
    onClose()
  }

  useEffect(() => {
    const playNotificationSound = () => {
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
        )
        audio.volume = 0.3
        audio.play().catch(() => {
          // Ignore audio play errors
        })
      } catch (error) {
        // Ignore audio errors
      }
    }

    playNotificationSound()
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Card className="bg-blue-50 border-blue-200 shadow-lg animate-pulse">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-blue-800 text-sm font-medium">{notification.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-blue-700 text-sm mb-3">{notification.message}</p>

          {notification.contact && (
            <div className="text-xs text-blue-600 mb-2">
              <strong>Kontakt z klientem:</strong> {notification.contact}
            </div>
          )}

          {notification.assignee && (
            <div className="text-xs text-blue-600 mb-2">
              <strong>Przypisane do:</strong> {notification.assignee}
            </div>
          )}

          {(notification.phone || notification.email) && (
            <div className="flex gap-2 mb-3">
              {notification.phone && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Phone className="h-3 w-3" />
                  {notification.phone}
                </div>
              )}
              {notification.email && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Mail className="h-3 w-3" />
                  {notification.email}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-3">
            <div className="flex gap-2">
              <Button size="sm" onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white text-xs">
                Zrobione
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRemindOptions(!showRemindOptions)}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs bg-transparent"
              >
                <Clock className="h-3 w-3 mr-1" />
                Przypomnij za
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs bg-transparent"
              >
                Zamknij
              </Button>
            </div>

            {showRemindOptions && (
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemind(15)}
                  className="text-xs px-2 py-1 h-6 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  15 min
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemind(30)}
                  className="text-xs px-2 py-1 h-6 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  30 min
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemind(60)}
                  className="text-xs px-2 py-1 h-6 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  1 godz
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-blue-500 mt-2">{notification.timestamp}</div>
        </CardContent>
      </Card>
    </div>
  )
}
