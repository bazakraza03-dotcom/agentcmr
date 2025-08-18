"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Shield, Users, Database, Maximize2, Minimize2, Copy, Trash2, Clock } from "lucide-react"

interface ClipboardItem {
  id: string
  content: string
  timestamp: Date
  type: "text" | "number" | "email"
}

interface RightSidebarProps {
  isExpanded: boolean
  onToggle: () => void
  isDarkMode: boolean
  onDarkModeToggle: () => void
}

export function RightSidebar({ isExpanded, onToggle, isDarkMode, onDarkModeToggle }: RightSidebarProps) {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([])

  const addClipboardItem = (content: string) => {
    if (content && content.trim()) {
      const newItem: ClipboardItem = {
        id: Date.now().toString(),
        content: content.trim(),
        timestamp: new Date(),
        type: detectContentType(content.trim()),
      }

      setClipboardItems((prev) => {
        const filtered = prev.filter((item) => item.content !== newItem.content)
        return [newItem, ...filtered].slice(0, 20) // Increased limit to 20 items
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        setTimeout(async () => {
          try {
            const text = await navigator.clipboard.readText()
            addClipboardItem(text)
          } catch (error) {
            console.log("[v0] Could not access clipboard automatically")
          }
        }, 100) // Small delay to ensure clipboard is updated
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleExpandSidebar = () => {
      if (!isExpanded) {
        onToggle()
      }
    }

    window.addEventListener("expand-right-sidebar", handleExpandSidebar)
    return () => window.removeEventListener("expand-right-sidebar", handleExpandSidebar)
  }, [isExpanded, onToggle])

  useEffect(() => {
    const event = new CustomEvent("right-sidebar-toggle", {
      detail: { isExpanded },
    })
    window.dispatchEvent(event)
  }, [isExpanded])

  const handleManualPaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      addClipboardItem(text)
    } catch (error) {
      console.log("[v0] Clipboard access denied or empty")
    }
  }

  const detectContentType = (text: string): "text" | "number" | "email" => {
    if (/^\d+$/.test(text)) return "number"
    if (/\S+@\S+\.\S+/.test(text)) return "email"
    return "text"
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearClipboard = () => {
    setClipboardItems([])
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
  }

  const deleteClipboardItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setClipboardItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div
      className={`bg-white border-l border-gray-200 transition-all duration-300 ${isExpanded ? "w-80" : "w-16"} flex flex-col`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {isExpanded && <span className="text-sm font-medium text-gray-700">Narzędzia</span>}
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="flex-1 p-3 overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Multi-schowek
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManualPaste}
                    className="h-6 w-6 p-0"
                    title="Wklej ze schowka"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearClipboard}
                    className="h-6 w-6 p-0"
                    title="Wyczyść wszystko"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Automatycznie przechwytuje Ctrl+C</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2 space-y-2">
              {clipboardItems.length === 0 ? (
                <div className="text-xs text-gray-500 text-center py-8">
                  <Copy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Brak skopiowanych elementów</p>
                  <p className="mt-1">Użyj Ctrl+C lub kliknij przycisk powyżej</p>
                </div>
              ) : (
                clipboardItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
                    onClick={() => copyToClipboard(item.content)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Copy className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item.type === "email"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : item.type === "number"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {item.type === "email" ? "📧 Email" : item.type === "number" ? "🔢 Numer" : "📝 Tekst"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.timestamp)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => deleteClipboardItem(item.id, e)}
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                          title="Usuń element"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 break-words leading-relaxed bg-white rounded p-2 border">
                      {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        {isExpanded && <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ustawienia</h3>}

        <Button
          variant="ghost"
          size="sm"
          className={`w-full ${isExpanded ? "justify-start" : "justify-center"} h-8`}
          onClick={onDarkModeToggle}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isExpanded && <span className="ml-2 text-xs">Tryb {isDarkMode ? "jasny" : "ciemny"}</span>}
        </Button>

        <Button variant="ghost" size="sm" className={`w-full ${isExpanded ? "justify-start" : "justify-center"} h-8`}>
          <Shield className="w-4 h-4" />
          {isExpanded && <span className="ml-2 text-xs">Uprawnienia</span>}
        </Button>

        <Button variant="ghost" size="sm" className={`w-full ${isExpanded ? "justify-start" : "justify-center"} h-8`}>
          <Users className="w-4 h-4" />
          {isExpanded && <span className="ml-2 text-xs">Użytkownicy</span>}
        </Button>

        <Button variant="ghost" size="sm" className={`w-full ${isExpanded ? "justify-start" : "justify-center"} h-8`}>
          <Database className="w-4 h-4" />
          {isExpanded && <span className="ml-2 text-xs">Baza danych</span>}
        </Button>
      </div>
    </div>
  )
}
