"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Users, FileText, CreditCard, AlertTriangle } from "lucide-react"

const monthlyData = [
  { month: "Sty", policies: 245, revenue: 125000, claims: 12 },
  { month: "Lut", policies: 289, revenue: 145000, claims: 18 },
  { month: "Mar", policies: 312, revenue: 167000, claims: 15 },
  { month: "Kwi", policies: 298, revenue: 158000, claims: 22 },
  { month: "Maj", policies: 334, revenue: 178000, claims: 19 },
  { month: "Cze", policies: 356, revenue: 189000, claims: 16 },
  { month: "Lip", policies: 378, revenue: 201000, claims: 14 },
  { month: "Sie", policies: 345, revenue: 185000, claims: 21 },
  { month: "Wrz", policies: 367, revenue: 195000, claims: 17 },
  { month: "Paź", policies: 389, revenue: 208000, claims: 13 },
  { month: "Lis", policies: 412, revenue: 225000, claims: 20 },
  { month: "Gru", policies: 445, revenue: 245000, claims: 18 },
]

const policyTypeData = [
  { name: "Komunikacyjne", value: 45, color: "#3b82f6" },
  { name: "Mieszkaniowe", value: 25, color: "#10b981" },
  { name: "Życiowe", value: 20, color: "#f59e0b" },
  { name: "Podróżne", value: 10, color: "#ef4444" },
]

const agentPerformance = [
  { name: "Jan Kowalski", policies: 89, revenue: 145000, conversion: 78 },
  { name: "Anna Nowak", policies: 76, revenue: 128000, conversion: 82 },
  { name: "Piotr Wiśniewski", policies: 65, revenue: 98000, conversion: 71 },
  { name: "Maria Wójcik", policies: 58, revenue: 87000, conversion: 69 },
  { name: "Tomasz Kowalczyk", policies: 52, revenue: 79000, conversion: 74 },
]

export default function StatystykiPage() {
  const [timeRange, setTimeRange] = useState("12m")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Statystyki</h1>
            <p className="text-gray-600">Analiza wyników i trendów biznesowych</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 miesiąc</SelectItem>
                <SelectItem value="3m">3 miesiące</SelectItem>
                <SelectItem value="6m">6 miesięcy</SelectItem>
                <SelectItem value="12m">12 miesięcy</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Eksportuj</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Łączne polisy</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,125</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% vs poprzedni miesiąc
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Przychody</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,145,000 zł</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% vs poprzedni miesiąc
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktywni klienci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,248</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5.7% vs poprzedni miesiąc
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Szkody</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">205</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -3.1% vs poprzedni miesiąc
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Trend przychodów</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} zł`, "Przychód"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Policy Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rozkład typów polis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={policyTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {policyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Wyniki miesięczne</CardTitle>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Przychody</SelectItem>
                  <SelectItem value="policies">Polisy</SelectItem>
                  <SelectItem value="claims">Szkody</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={selectedMetric} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Wyniki agentów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-500">{agent.policies} polis</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{agent.revenue.toLocaleString()} zł</div>
                    <div className="text-sm text-gray-500">{agent.conversion}% konwersja</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
