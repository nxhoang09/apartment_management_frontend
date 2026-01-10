"use client"

import { FeeAssignmentItem } from "@/lib/api/fee/feeAssignmentsApi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper format tiền tệ & ngày tháng (đặt tại đây hoặc chuyển vào file utils chung)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("vi-VN")
}

const getPeriodLabel = (dateString: string | null) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `Tháng ${month}/${year}`
}

interface FeeCardProps {
  item: FeeAssignmentItem
  type: 'paid' | 'unpaid'
  onPaymentClick?: (id: number) => void // Callback khi bấm thanh toán
}

export function FeeCard({ item, type, onPaymentClick }: FeeCardProps) {
  // Logic kiểm tra trạng thái Payment
  const isPending = !item.isPaid && item.Payment?.status === "PENDING"
  const isRejected = !item.isPaid && item.Payment?.status === "REJECTED"

  const periodLabel = getPeriodLabel(item.dueDate)

  // Xác định màu sắc chỉ báo
  let statusColorClass = ""
  if (type === 'paid') statusColorClass = "bg-green-600"
  else if (isPending) statusColorClass = "bg-yellow-500"
  else if (isRejected) statusColorClass = "bg-destructive"
  else statusColorClass = "bg-destructive" // Mặc định chưa đóng là màu đỏ

  const renderStatusBadge = () => {
    if (type === "paid") {
      return <Badge variant="secondary" className="bg-green-100 text-green-700">Đã thanh toán</Badge>
    }
    if (isPending) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ duyệt</Badge>
    }
    if (isRejected) {
      return <Badge variant="destructive">Bị từ chối</Badge>
    }
    return <Badge variant="outline" className="text-destructive border-destructive/50">Chưa đóng</Badge>
  }

  return (
    <Card className="h-full border border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            {periodLabel && (
              <Badge variant="secondary" className="bg-muted text-foreground">
                {periodLabel}
              </Badge>
            )}
            {renderStatusBadge()}
          </div>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">
            {item.fee?.name || "Khoản phí"}
          </h3>
          {item.dueDate && (
            <p className="text-sm text-muted-foreground">
              Hạn đóng: <span className="font-semibold text-foreground">{formatDate(item.dueDate)}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1 text-sm text-muted-foreground">
            {type === "paid" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Thanh toán: {formatDate(item.paidDate)}</span>
              </div>
            )}
          </div>
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 group">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          
          {/* Cột màu trạng thái bên trái */}
          <div className={cn("w-full sm:w-2 shrink-0 h-2 sm:h-auto", statusColorClass)} />

          <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            {/* --- Phần Thông tin --- */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.fee?.name}
                </h3>
                
                {/* Badges trạng thái đặc biệt */}
                {isPending && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Chờ duyệt
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                    Bị từ chối
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.fee?.description || "Phí dịch vụ định kỳ"}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Hạn: <span className="font-medium text-foreground">{formatDate(item.dueDate)}</span></span>
                </div>
                {type === 'paid' && (
                  <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Thanh toán: {formatDate(item.paidDate)}</span>
                  </div>
                )}
              </div>
              
              {/* Lý do từ chối - hiển thị khi bị từ chối */}
              {isRejected && item.Payment?.note && (
                <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2 text-sm">
                  <span className="font-medium text-destructive">Lý do từ chối: </span>
                  <span className="text-destructive/90">{item.Payment.note}</span>
                </div>
              )}
            </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Số tiền</p>
              <p className={cn(
                "text-2xl font-semibold",
                type === 'unpaid' ? "text-primary" : "text-green-600"
              )}>
                {formatCurrency(item.amountDue)}
              </p>
            </div>

            {type === 'unpaid' && !isPending && (
              <Button 
                className={cn(
                  "w-full sm:w-auto",
                  isRejected ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
                )}
                variant={isRejected ? "destructive" : "default"}
                onClick={() => onPaymentClick?.(item.id)}
              >
                <Receipt className="mr-2 h-4 w-4" />
                {isRejected ? "Thanh toán lại" : "Thanh toán ngay"}
              </Button>
            )}

            {isPending && (
              <p className="text-xs italic text-muted-foreground">
                Đang chờ BQL xác nhận...
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}