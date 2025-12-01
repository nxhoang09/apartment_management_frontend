"use client"

import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFeeContext } from "@/lib/context/fee-context"
import { Fee } from "@/lib/api/fee/feesApi"
import { FeeAssignmentItem } from "@/lib/api/fee/feeAssignmentsApi"
import { Eye, CheckCircle, XCircle } from "lucide-react"

export function FeeDetailByFeeModal({ feeId, onClose }: { feeId: number; onClose: () => void }) {
  const { getFeeDetail, approvePayment, rejectPayment } = useFeeContext()
  const [data, setData] = useState<(Fee & { assignments: FeeAssignmentItem[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedPayment, setSelectedPayment] = useState<FeeAssignmentItem | null>(null)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    getFeeDetail(feeId)
      .then(setData)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [feeId, getFeeDetail])

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
      handleCloseDetail()
      fetchData()
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedPayment?.Payment?.id) return
    if (!rejectNote.trim()) return

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
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chi tiết thu phí: {loading ? "..." : data?.name}</DialogTitle>
            <DialogDescription>Danh sách các hộ cần đóng khoản phí này</DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : data ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-muted/50 p-3 rounded">Tổng số hộ: <span className="font-bold">{data.assignments.length}</span></div>
                <div className="bg-muted/50 p-3 rounded">Đã duyệt: <span className="font-bold text-green-600">{data.assignments.filter(a => a.isPaid).length}</span></div>
                <div className="bg-muted/50 p-3 rounded">Chờ duyệt: <span className="font-bold text-yellow-600">{data.assignments.filter(a => a.Payment?.status === "PENDING").length}</span></div>
              </div>
              
              <ScrollArea className="flex-1 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hộ</TableHead>
                      <TableHead>Chủ hộ</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Hạn nộp</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.assignments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.household?.houseHoldCode}</TableCell>
                        <TableCell>{item.household?.head?.fullname || "N/A"}</TableCell>
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
            </>
          ) : (
            <div className="py-10 text-center text-red-500">Không tìm thấy dữ liệu</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Detail Dialog */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && handleCloseDetail()}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Thông tin thanh toán - Hộ {selectedPayment.household?.houseHoldCode}</DialogTitle>
              <DialogDescription>
                Chủ hộ: {selectedPayment.household?.head?.fullname}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số tiền</p>
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

               {/* Nếu REJECTED thì hiện note */}
               {selectedPayment.Payment?.status === "REJECTED" && selectedPayment.Payment.note && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                   <p className="text-sm font-bold text-red-600 mb-1">Lý do từ chối:</p>
                   <p className="text-sm">{selectedPayment.Payment.note}</p>
                </div>
              )}

              {/* ACTION: Chỉ hiện khi PENDING */}
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
                        placeholder="Nhập lý do từ chối..." 
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setRejectMode(false)} disabled={actionLoading}>Hủy</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectNote.trim() || actionLoading}>
                          Xác nhận
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