import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "AgentCMR - System zarządzania ubezpieczeniami",
  description: "Profesjonalny system zarządzania ubezpieczeniami dla agentów i brokerów - Bartłomiej Mazurek",
  generator: "AgentCMR",
  authors: [{ name: "Bartłomiej Mazurek" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
