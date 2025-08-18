"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"

export default function Agent21Dashboard() {
  return (
    <AuthGuard>
      <DashboardLayout title="Ekran początkowy">
        <div className="space-y-6">
          <DashboardStats />

          {/* Bieżące statystyki Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <BarChart className="w-5 h-5 text-gray-500" />
                Bieżące statystyki
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-80 flex items-end justify-center gap-4 px-4">
                {/* Chart bars */}
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-400 mb-2" style={{ height: "160px" }}></div>
                  <span className="text-xs text-gray-500">2020-08</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-blue-400 mb-2 relative" style={{ height: "200px" }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">2020-09</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-500 mb-2 relative" style={{ height: "180px" }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">2020-10</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-400 mb-2 relative" style={{ height: "220px" }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">2020-11</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-300 mb-2 relative" style={{ height: "140px" }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">2020-12</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-200 mb-2" style={{ height: "240px" }}></div>
                  <span className="text-xs text-gray-500">2021-01</span>
                </div>
              </div>
              {/* Y-axis labels */}
              <div className="absolute left-4 top-16 h-64 flex flex-col justify-between text-xs text-gray-500">
                <span>700000</span>
                <span>600000</span>
                <span>500000</span>
                <span>400000</span>
                <span>300000</span>
                <span>200000</span>
                <span>100000</span>
                <span>0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
