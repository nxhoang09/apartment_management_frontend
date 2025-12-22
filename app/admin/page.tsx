"use client"

import { useState } from "react"
import { HouseholdTable } from "@/components/admin/household-table"
import { HouseholdDetailModal } from "@/components/admin/household-detail-modal"
import { useAdmin } from "@/lib/context/admin-context" // Sửa lại path import cho đúng cấu trúc của bạn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

// Cập nhật interface theo đúng JSON backend trả về
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
  workingAdress: string // Backend trả về 1 chữ 'd' theo JSON mẫu
  residentStatus: string // Đã sửa từ residencStatus
  houseHoldId: number
}

export default function AdminPage() {
  // Lấy thêm các hàm và state từ context mới
  const { households, loading, meta, setPage, setSearch, searchQuery } = useAdmin()
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempSearch, setTempSearch] = useState(searchQuery)

  const handleDetailClick = (household: any) => {
    setSelectedHousehold(household)
    setIsDialogOpen(true)
  }

  // Xử lý khi nhấn Enter hoặc nút tìm kiếm
  const handleSearch = () => {
    setPage(1) // Reset về trang 1 khi tìm kiếm mới
    setSearch(tempSearch)
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Hộ gia đình</h1>
            <p className="text-muted-foreground">Danh sách các hộ gia đình trong hệ thống</p>
          </div>
          
          {/* Khu vực Tìm kiếm */}
          <div className="flex w-full md:w-auto items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm theo tên chủ hộ, số căn..."
                className="pl-8 w-[300px]"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </div>
        </div>

        {loading ? (
           <div className="flex items-center justify-center h-64 border rounded-md">
             <div className="text-lg text-muted-foreground">Đang tải dữ liệu...</div>
           </div>
        ) : (
          <>
            <HouseholdTable households={households} onDetailClick={handleDetailClick} />
            
            {/* Khu vực Phân trang */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Trang {meta.page} / {meta.totalPages} (Tổng {meta.total} hộ)
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(meta.page - 1)}
                  disabled={meta.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                >
                  Sau <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <HouseholdDetailModal 
        household={selectedHousehold} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </main>
  )
}