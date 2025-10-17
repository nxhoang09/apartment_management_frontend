"use client"

import { ResidentSidebar } from "@/components/resident-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, CheckCircle2, Clock, XCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function ResidentDeclarationsPage() {
  // Mock data
  const declarations = [
    {
      id: 1,
      type: "temporary_residence",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      reason: "Khách đến thăm",
      status: "pending",
      submittedDate: "2025-01-05",
    },
    {
      id: 2,
      type: "temporary_absence",
      startDate: "2024-12-20",
      endDate: "2025-01-20",
      reason: "Công tác xa",
      status: "approved",
      submittedDate: "2024-12-15",
      reviewedDate: "2024-12-16",
    },
    {
      id: 3,
      type: "temporary_residence",
      startDate: "2024-11-01",
      endDate: "2024-12-01",
      reason: "Người thân đến ở",
      status: "approved",
      submittedDate: "2024-10-25",
      reviewedDate: "2024-10-26",
    },
  ]

  const getTypeLabel = (type: string) => {
    return type === "temporary_residence" ? "Tạm trú" : "Tạm vắng"
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { label: "Chờ duyệt", variant: "outline" as const, icon: Clock, color: "text-accent" },
      approved: { label: "Đã duyệt", variant: "default" as const, icon: CheckCircle2, color: "text-chart-4" },
      rejected: { label: "Từ chối", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const stats = {
    total: declarations.length,
    pending: declarations.filter((d) => d.status === "pending").length,
    approved: declarations.filter((d) => d.status === "approved").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ResidentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Khai báo của tôi</h1>
              <p className="text-muted-foreground mt-2">Quản lý khai báo tạm trú và tạm vắng</p>
            </div>
            <Button asChild className="group">
              <Link href="/resident/declarations/new">
                <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
                Tạo khai báo mới
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng khai báo</p>
                    <p className="text-2xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                    <p className="text-2xl font-bold mt-2">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                    <p className="text-2xl font-bold mt-2">{stats.approved}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Declarations List */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử khai báo</CardTitle>
              <CardDescription>Danh sách các khai báo bạn đã gửi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {declarations.map((declaration) => {
                  const statusConfig = getStatusConfig(declaration.status)
                  const StatusIcon = statusConfig.icon

                  return (
                    <div
                      key={declaration.id}
                      className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{getTypeLabel(declaration.type)}</h3>
                              <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Thời gian:</p>
                                <p className="font-medium">
                                  {declaration.startDate} đến {declaration.endDate}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Lý do:</p>
                                <p className="font-medium">{declaration.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Nộp ngày: {declaration.submittedDate}</span>
                              {declaration.reviewedDate && <span>• Duyệt ngày: {declaration.reviewedDate}</span>}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
