"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PolicyList } from "@/components/policy-list"
import { PolicyForm } from "@/components/policy-form"
import { PolicyImport } from "@/components/policy-import"
import { BrowserPolicyImport } from "@/components/browser-policy-import"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"

export default function PoliciesPage() {
  const [view, setView] = useState<"list" | "form" | "import" | "browser-import">("list")
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)

  const handleEditPolicy = (policyId: string) => {
    setSelectedPolicyId(policyId)
    setView("form")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedPolicyId(null)
  }

  return (
    <AuthGuard>
      <DashboardLayout title="Polisy">
        <div className="space-y-4">
          {view === "list" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button onClick={() => setView("form")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nowa polisa
                  </Button>
                  <Button variant="outline" onClick={() => setView("import")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import polis
                  </Button>
                  <Button variant="outline" onClick={() => setView("browser-import")}>
                    <Download className="w-4 h-4 mr-2" />
                    Import z przeglądarki TU
                  </Button>
                </div>
              </div>
              <PolicyList onEditPolicy={handleEditPolicy} />
            </>
          )}

          {view === "form" && <PolicyForm policyId={selectedPolicyId} onBack={handleBackToList} />}

          {view === "import" && <PolicyImport onBack={handleBackToList} />}

          {view === "browser-import" && <BrowserPolicyImport onBack={handleBackToList} />}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
