"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientsList } from "@/components/clients-list"

export default function ClientsPage() {
  return (
    <AuthGuard>
      <DashboardLayout title="Klienci">
        <ClientsList />
      </DashboardLayout>
    </AuthGuard>
  )
}
