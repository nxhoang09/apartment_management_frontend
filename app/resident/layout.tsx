"use client"

import React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HouseholdProvider } from "@/lib/context/household-context"

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      <ProtectedRoute allowedRoles={["USER"]}>{children}</ProtectedRoute>
    </HouseholdProvider>
  )
}
