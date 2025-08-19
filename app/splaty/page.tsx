"use client"
export const dynamic = 'force-dynamic'

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PaymentsList } from "@/components/payments-list"

export default function PaymentsPage() {
  return (
    <AuthGuard>
      <DashboardLayout title="SpĹ‚aty">
        <PaymentsList />
      </DashboardLayout>
    </AuthGuard>
  )
}
