"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VehiclesList } from "@/components/vehicles-list"

export default function VehiclesPage() {
  return (
    <AuthGuard>
      <DashboardLayout title="Pojazdy">
        <VehiclesList />
      </DashboardLayout>
    </AuthGuard>
  )
}
