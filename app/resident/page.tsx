"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useHousehold } from "@/lib/context/household-context"
import { AddMemberDialog } from "@/components/resident/add-member-dialog"
import { EditMemberDialog } from "@/components/resident/edit-member-dialog"
import { EditHouseholdDialog } from "@/components/resident/edit-household-dialog"
import { Member } from "@/components/resident/member-card"
import { MembersList } from "@/components/resident/member-list"
import { HouseholdInfoCard } from "@/components/resident/household-info-card"
import { ResidentSidebar } from "@/components/resident/resident-sidebar"
import { ConfirmDeleteMemberDialog } from "@/components/resident/confirm-delete-member"
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isEditHouseholdOpen, setIsEditHouseholdOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Mở dialog sửa
  const handleEditMember = (member: Member) => {
    setSelectedMember(member)
    setIsEditDialogOpen(true)
  }

  // Khi bấm xóa, chỉ mở dialog xác nhận
  const handleDeleteMember = (id: string) => {
    setConfirmDeleteId(id)
  }

  // Hàm xác nhận xóa thật sự
  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    setDeleteLoading(true)
    setDeleteError("")
    try {
      await deleteMember(confirmDeleteId)
      setConfirmDeleteId(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Lỗi khi xóa thành viên")
    } finally {
      setDeleteLoading(false)
    }
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
      <div className={`transition-all duration-300 px-4 py-8 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        {/* Banner chào người dùng
        <WelcomeBanner userName={user.username} /> */}
        <ResidentSidebar
          userName={user.username}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Thông tin hộ khẩu */}
        <HouseholdInfoCard
          info={{
                  houseHoldCode: String(household.household.houseHoldCode),
                  apartmentNumber: household.household.apartmentNumber,
                  buildingNumber: household.household.buildingNumber,
                  street: household.household.street,
                  ward: household.household.ward,
                  province: household.household.province,
                  status: household.household.status,
                  head: household.head?.fullname ?? "Chưa có chủ hộ",
                }}
          onEdit={()=>{
            console.log(">> Bấm nút Chỉnh sửa hộ khẩu")
            setIsEditHouseholdOpen(true)
          }} 
        />
        <EditHouseholdDialog
          household={household.household}
          open={isEditHouseholdOpen}
          onOpenChange={setIsEditHouseholdOpen}
        />

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

        <ConfirmDeleteMemberDialog
          open={!!confirmDeleteId}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={confirmDelete}
          loading={deleteLoading}
          error={deleteError}
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
