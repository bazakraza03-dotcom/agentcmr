"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, UserCheck, Calendar, Database, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  icon: React.ReactNode
  stats: Array<{
    label: string
    value: string | number
    trend?: "up" | "down" | "neutral"
    color?: string
  }>
}

function StatCard({ title, icon, stats }: StatCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-700 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex-1">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${stat.color || "text-gray-800"}`}>{stat.value}</span>
              {stat.trend && (
                <div className="flex items-center">
                  {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {stat.trend === "neutral" && <Minus className="w-4 h-4 text-gray-400" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Wznowienia Card */}
      <StatCard
        title="Wznowienia"
        icon={<Send className="w-5 h-5 text-blue-500" />}
        stats={[
          { label: "polisy do wznowienia dzisiaj:", value: 2, trend: "up", color: "text-blue-600" },
          {
            label: "polisy do wznowienia w ciągu najbliższych 14 dni:",
            value: 89,
            trend: "up",
            color: "text-blue-600",
          },
        ]}
      />

      {/* Spłaty / raty Card */}
      <StatCard
        title="Spłaty / raty"
        icon={<UserCheck className="w-5 h-5 text-green-500" />}
        stats={[
          { label: "spłaty wymagające działań:", value: 3, color: "text-green-600" },
          { label: "spłaty wymagające działań w najbliższych 14 dni:", value: 57, color: "text-green-600" },
          { label: "spłaty zależne (nieopłacone):", value: 216, color: "text-orange-600" },
        ]}
      />

      {/* Zaplanowane zadania Card */}
      <StatCard
        title="Zaplanowane zadania"
        icon={<Calendar className="w-5 h-5 text-purple-500" />}
        stats={[
          { label: "zadania na dzisiaj:", value: 1, color: "text-purple-600" },
          { label: "zadania na najbliższe 7 dni:", value: 3, color: "text-purple-600" },
          { label: "zadania niewykonane w poprzednich dniach:", value: 0, color: "text-gray-500" },
        ]}
      />

      {/* Twoja baza danych Card */}
      <StatCard
        title="Twoja baza danych"
        icon={<Database className="w-5 h-5 text-indigo-500" />}
        stats={[
          { label: "liczba polis:", value: "9,248", color: "text-indigo-600" },
          { label: "liczba klientów:", value: "5,466", color: "text-indigo-600" },
          { label: "liczba pojazdów:", value: "3,050", color: "text-indigo-600" },
          { label: "liczba spłat:", value: "5,037", color: "text-indigo-600" },
        ]}
      />
    </div>
  )
}
