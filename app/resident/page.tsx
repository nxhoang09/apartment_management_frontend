"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useHousehold } from "@/lib/context/household-context"

export default function ResidentPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { household, isLoading: isHouseholdLoading, refreshHousehold } = useHousehold()

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/login")
    }
  }, [isAuthLoading, user, router])

  useEffect(() => {
  if (isAuthLoading || isHouseholdLoading) return // Đợi load data

  if (!user) {
    router.replace("/auth/login")
    return
  }

  // Nếu có user nhưng không có household sau khi đã load xong
  if (!household) {
    router.replace("/resident/form")
  }
}, [isAuthLoading, isHouseholdLoading, user, household, router])


  useEffect(() => {
    if (!isHouseholdLoading && !household && user) {
      refreshHousehold()
    }
  }, [user])

  if (isAuthLoading || isHouseholdLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (!user || !household) return null

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Xin chào, {user.username}!
      </h1>
      <h2 className="text-lg mb-2">Thông tin hộ khẩu của bạn:</h2>
      <div className="border rounded p-4 bg-gray-50">
        <p><strong>Mã hộ khẩu:</strong> {household.houseHoldCode}</p>
        <p><strong>Số căn hộ:</strong> {household.apartmentNumber}</p>
        <p><strong>Tòa nhà:</strong> {household.buildingNumber}</p>
        <p><strong>Đường:</strong> {household.street}</p>
        <p><strong>Phường:</strong> {household.ward}</p>
        <p><strong>Tỉnh/Thành:</strong> {household.province}</p>
        <p><strong>Trạng thái:</strong> {household.status}</p>
      </div>
    </div>
  )
}
