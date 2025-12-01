"use client"

import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea" // Đảm bảo bạn có component Textarea
import { Label } from "@/components/ui/label"
import { useFeeContext } from "@/lib/context/fee-context"
import { FeeAssignmentItem } from "@/lib/api/fee/feeAssignmentsApi"
import { useAdmin } from "@/lib/context/admin-context"
import { Eye, CheckCircle, XCircle } from "lucide-react" 

export function FeeDetailByHouseholdModal({ householdId, onClose }: { householdId: number; onClose: () => void }) {
  const { getHouseholdFees, approvePayment, rejectPayment } = useFeeContext()
  const { households } = useAdmin()
  const [assignments, setAssignments] = useState<FeeAssignmentItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedPayment, setSelectedPayment] = useState<FeeAssignmentItem | null>(null)
  
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const currentHousehold = households?.find((h: any) => h.id === householdId)

  const fetchData = useCallback(() => {
    setLoading(true)
    getHouseholdFees(householdId)
      .then(setAssignments)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [householdId, getHouseholdFees])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCloseDetail = () => {
    setSelectedPayment(null)
    setRejectMode(false)
    setRejectNote("")
  }

  const handleApprove = async () => {
    if (!selectedPayment?.Payment?.id) return
    try {
      setActionLoading(true)
      await approvePayment(selectedPayment.Payment.id)
      handleCloseDetail() // Đóng dialog chi tiết
      fetchData() // Load lại danh sách để cập nhật trạng thái
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedPayment?.Payment?.id) return
    if (!rejectNote.trim()) return // Bắt buộc nhập lý do

    try {
      setActionLoading(true)
      await rejectPayment(selectedPayment.Payment.id, rejectNote)
      handleCloseDetail()
      fetchData()
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      {/* Modal danh sách */}
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Phí của hộ: {currentHousehold ? `${currentHousehold.apartmentNumber} - ${currentHousehold.buildingNumber}` : householdId}
            </DialogTitle>
            <DialogDescription>Danh sách các khoản phí cần đóng của hộ này</DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <ScrollArea className="flex-1 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên khoản phí</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Hạn nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead className="text-right">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center">Hộ này chưa có khoản phí nào</TableCell></TableRow>
                  ) : assignments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.fee?.name}</TableCell>
                      <TableCell>{item.amountDue.toLocaleString()} đ</TableCell>
                      <TableCell>{new Date(item.dueDate).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.isPaid ? "default" : "secondary"} 
                          className={
                             item.isPaid ? "bg-green-600 hover:bg-green-700" :
                             (item.Payment?.status === "REJECTED" ? "bg-red-500 hover:bg-red-600" : 
                              item.Payment?.status === "PENDING" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400")
                          }
                        >
                          {item.isPaid ? "Đã duyệt" : 
                           item.Payment?.status === "REJECTED" ? "Bị từ chối" :
                           item.Payment?.status === "PENDING" ? "Chờ duyệt" : "Chưa nộp"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.paidDate ? new Date(item.paidDate).toLocaleDateString("vi-VN") : "-"}</TableCell>
                      <TableCell className="text-right">
                        {item.Payment && (
                          <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal chi tiết thanh toán & Action */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && handleCloseDetail()}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Thông tin thanh toán</DialogTitle>
              <DialogDescription>Chi tiết giao dịch cho khoản phí: {selectedPayment.fee?.name}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số tiền đã nộp</p>
                  <p className="text-lg font-bold">{selectedPayment.Payment?.amountPaid.toLocaleString()} đ</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <Badge variant={selectedPayment.Payment?.status === "REJECTED" ? "destructive" : selectedPayment.Payment?.status === "APPROVED" ? "default" : "secondary"}>
                    {selectedPayment.Payment?.status}
                  </Badge>
                </div>
              </div>

              {/* Hiển thị ảnh */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Ảnh minh chứng</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                  {selectedPayment.Payment?.imageUrl ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img 
                       src={selectedPayment.Payment.imageUrl} 
                       alt="Payment proof" 
                       className="object-contain w-full h-full"
                     />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Không có ảnh</div>
                  )}
                </div>
              </div>

              {/* Hiển thị Note nếu đã reject */}
              {selectedPayment.Payment?.status === "REJECTED" && selectedPayment.Payment.note && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                   <p className="text-sm font-bold text-red-600 mb-1">Lý do từ chối:</p>
                   <p className="text-sm">{selectedPayment.Payment.note}</p>
                </div>
              )}

              {/* VÙNG ACTION: Chỉ hiện khi PENDING */}
              {selectedPayment.Payment?.status === "PENDING" && (
                <div className="mt-4 border-t pt-4">
                  {!rejectMode ? (
                    <div className="flex gap-3 justify-end">
                      <Button variant="destructive" onClick={() => setRejectMode(true)}>
                        <XCircle className="w-4 h-4 mr-2" /> Từ chối
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={actionLoading}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Duyệt thanh toán
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="reject-reason" className="text-red-600">Lý do từ chối (bắt buộc)</Label>
                      <Textarea 
                        id="reject-reason"
                        placeholder="VD: Ảnh mờ, không đúng số tiền..." 
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setRejectMode(false)} disabled={actionLoading}>Hủy</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectNote.trim() || actionLoading}>
                          Xác nhận từ chối
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}