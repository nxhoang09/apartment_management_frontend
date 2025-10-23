"use client"

import { AddMemberDialog } from "@/components/resident/add-member-dialog"
import { Member } from "@/components/resident/member-card"
import { MembersList } from "@/components/resident/member-list"
import { HouseholdInfoCard } from "@/components/resident/household-info-card"
import { WelcomeBanner } from "@/components/resident/welcome-banner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useHousehold } from "@/lib/context/household-context"

export default function ResidentPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { household, isLoading: isHouseholdLoading, members, addMember } = useHousehold()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddMember = async (data: Omit<Member, "id">) => {
    try {
      await addMember(data)
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err)
    }
  }

  useEffect(() => {
    if (!isAuthLoading && !user) router.replace("/auth/login")
  }, [isAuthLoading, user, router])

  useEffect(() => {
    if (isAuthLoading || isHouseholdLoading) return
    if (!user) return router.replace("/auth/login")
    if (!household) router.replace("/resident/form")
  }, [isAuthLoading, isHouseholdLoading, user, household, router])

  if (isAuthLoading || isHouseholdLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (!user || !household) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WelcomeBanner userName={user.username} />
        <HouseholdInfoCard info={household} />
        <MembersList members={members} onAddMember={() => setIsDialogOpen(true)} />
        <AddMemberDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddMember={handleAddMember}
        />
      </div>
    </div>
  )
}
