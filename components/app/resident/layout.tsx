"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute allowedRoles={["USER"]}>{children}</ProtectedRoute>
}
