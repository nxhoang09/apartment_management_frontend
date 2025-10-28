"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useHousehold } from "@/lib/context/household-context"
import { AddMemberDialog } from "@/components/resident/add-member-dialog"
import { EditMemberDialog } from "@/components/resident/edit-member-dialog"
import { Member } from "@/components/resident/member-card"
import { MembersList } from "@/components/resident/member-list"
import { HouseholdInfoCard } from "@/components/resident/household-info-card"
import { WelcomeBanner } from "@/components/resident/welcome-banner"
import { ResidentSidebar } from "@/components/resident/resident-sidebar"
export default function ResidentPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const {
    household,
    isLoading: isHouseholdLoading,
    members,
    updateMember,
    deleteMember, // Thêm hàm xóa member từ context
  } = useHousehold()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // Mở dialog sửa
  const handleEditMember = (member: Member) => {
    setSelectedMember(member)
    setIsEditDialogOpen(true)
  }

  // Điều hướng khi chưa đăng nhập
  useEffect(() => {
    if (!isAuthLoading && !user) router.replace("/auth/login")
  }, [isAuthLoading, user, router])

  // Điều hướng khi chưa có hộ khẩu
  useEffect(() => {
    if (isAuthLoading || isHouseholdLoading) return
    if (!user) return router.replace("/auth/login")
    if (!household) router.replace("/resident/form")
  }, [isAuthLoading, isHouseholdLoading, user, household, router])

  const handleDeleteMember = async (id: string) => {
    setDeleteLoading(true)
    setDeleteError("")
    try {
      await deleteMember(id)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Lỗi khi xóa thành viên")
    } finally {
      setDeleteLoading(false)
    }
  }

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
        {/* Banner chào người dùng
        <WelcomeBanner userName={user.username} /> */}
        <ResidentSidebar userName={user.username}/>

        {/* Thông tin hộ khẩu */}
        <HouseholdInfoCard info={household} />

        {/* Danh sách thành viên */}
        <MembersList
          members={members}
          onAddMember={() => setIsDialogOpen(true)}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />

        {/* Dialog thêm thành viên  */}
        <AddMemberDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

        {/* Dialog chỉnh sửa thành viên */}
        {selectedMember && (
          <EditMemberDialog
            member={selectedMember}
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open)
              if (!open) setSelectedMember(null)
            }}
            onUpdateMember={updateMember}
          />
        )}
      </div>
    </div>
  )
}
