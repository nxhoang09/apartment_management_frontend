"use client"

import { useEffect, useState } from "react"
import { HouseholdTable } from "@/components/admin/household-table"
import { HouseholdDetailModal } from "@/components/admin/household-detail-modal"
import { useAdmin } from "@/lib/context/admin-context"
interface Resident {
  id: number
  nationalId: string
  phoneNumber: string
  email: string
  fullname: string
  dateOfBirth: string
  gender: string
  relationshipToHead: string
  placeOfOrigin: string
  occupation: string
  workingAdress: string
  residencStatus: string
  houseHoldId: number
}

interface HouseHold {
  id: number
  houseHoldCode: number
  apartmentNumber: string
  buildingNumber: string
  street: string
  ward: string
  province: string
  status: string
  createtime: string
  headID: number
  userID: number
  resident: Resident[]
}

export default function AdminPage() {
   const { households, loading } = useAdmin()
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDetailClick = (household: any) => {
    setSelectedHousehold(household)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Hộ gia đình</h1>
          <p className="text-muted-foreground">Danh sách các hộ gia đình trong hệ thống</p>
        </div>

        <HouseholdTable households={households} onDetailClick={handleDetailClick} />
      </div>

      <HouseholdDetailModal household={selectedHousehold} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </main>
  )
}
