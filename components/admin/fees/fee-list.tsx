"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CreateFeeModal } from "./create-fee-modal"
import { useFeeContext } from "@/lib/context/fee-context"
import { Pencil, Trash2, Plus } from "lucide-react" // Import icon nếu có, hoặc dùng text
import { Fee } from "@/lib/api/fee/feesApi"
import { toast } from "sonner"

export function FeeList() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFee, setEditingFee] = useState<Fee | null>(null) // State để lưu fee đang sửa
  const { fees, deleteFee } = useFeeContext()

  const handleEdit = (fee: Fee) => {
    setEditingFee(fee)
    setShowCreateModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khoản phí này? Hành động này không thể hoàn tác.")) {
      try {
        await deleteFee(id)
        toast.success("Đã xóa khoản phí thành công")
      } catch (error) {
        toast.error("Xóa thất bại", {
            description: error instanceof Error ? error.message : "Có lỗi xảy ra"
        })
      }
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingFee(null) // Reset editing fee khi đóng modal
  }

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Danh sách loại phí</h2>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2"/>
            Tạo phí mới
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khoản phí</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tần suất</TableHead>
                <TableHead>Tỉ lệ/người</TableHead>
                <TableHead>Tối thiểu</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>{fee.type}</TableCell>
                  <TableCell>{fee.frequency}</TableCell>
                  <TableCell>{fee.ratePerPerson ? fee.ratePerPerson.toLocaleString() : "-"}</TableCell>
                  <TableCell>{fee.minium?.toLocaleString() || "-"}</TableCell>
                  <TableCell>{fee.startDate ? new Date(fee.startDate).toLocaleDateString("vi-VN") : "-"}</TableCell>
                  <TableCell>{fee.endDate ? new Date(fee.endDate).toLocaleDateString("vi-VN") : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(fee)}
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(fee.id)}
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {fees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Chưa có khoản phí nào. Hãy tạo khoản phí mới.</div>
        )}
      </div>

      {showCreateModal && (
        <CreateFeeModal
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal()
          }}
          feeToEdit={editingFee} // Truyền fee cần sửa vào modal
        />
      )}
    </Card>
  )
}