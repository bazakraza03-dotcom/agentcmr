"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RenewalsList } from "@/components/renewals-list"

export default function RenewalsPage() {
  return (
    <AuthGuard>
      <DashboardLayout title="Wznowienia">
        <RenewalsList />
      </DashboardLayout>
    </AuthGuard>
  )
}
