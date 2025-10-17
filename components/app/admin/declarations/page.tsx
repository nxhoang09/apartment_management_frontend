"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, CheckCircle2, Clock, XCircle, Building2, Calendar } from "lucide-react"
import { useState } from "react"

export default function DeclarationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Mock data
  const declarations = [
    {
      id: 1,
      resident: "Nguyễn Văn A",
      apartment: "A-101",
      type: "temporary_residence",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      reason: "Khách đến thăm",
      status: "pending",
      submittedDate: "2025-01-05",
    },
    {
      id: 2,
      resident: "Trần Thị B",
      apartment: "A-102",
      type: "temporary_absence",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      reason: "Công tác xa",
      status: "approved",
      submittedDate: "2025-01-04",
      reviewedDate: "2025-01-05",
    },
    {
      id: 3,
      resident: "Lê Văn C",
      apartment: "B-201",
      type: "temporary_residence",
      startDate: "2025-01-08",
      endDate: "2025-03-08",
      reason: "Người thân đến ở",
      status: "pending",
      submittedDate: "2025-01-03",
    },
    {
      id: 4,
      resident: "Phạm Thị D",
      apartment: "B-202",
      type: "temporary_absence",
      startDate: "2024-12-20",
      endDate: "2025-01-20",
      reason: "Du lịch",
      status: "approved",
      submittedDate: "2024-12-15",
      reviewedDate: "2024-12-16",
    },
    {
      id: 5,
      resident: "Hoàng Văn E",
      apartment: "C-301",
      type: "temporary_residence",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      reason: "Khách thuê ngắn hạn",
      status: "rejected",
      submittedDate: "2024-12-28",
      reviewedDate: "2024-12-29",
      rejectionReason: "Không đủ giấy tờ",
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

  const filteredDeclarations = declarations.filter((declaration) => {
    const matchesSearch =
      declaration.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.apartment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || declaration.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: declarations.length,
    pending: declarations.filter((d) => d.status === "pending").length,
    approved: declarations.filter((d) => d.status === "approved").length,
    rejected: declarations.filter((d) => d.status === "rejected").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Quản lý khai báo</h1>
            <p className="text-muted-foreground mt-2">Xử lý khai báo tạm trú và tạm vắng của cư dân</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
                    <p className="text-2xl font-bold mt-2">{stats.rejected}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên cư dân hoặc căn hộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Tất cả
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Chờ duyệt
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Đã duyệt
              </Button>
            </div>
          </div>

          {/* Declarations List */}
          <div className="space-y-4">
            {filteredDeclarations.map((declaration) => {
              const statusConfig = getStatusConfig(declaration.status)
              const StatusIcon = statusConfig.icon

              return (
                <Card key={declaration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0`}
                        >
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{declaration.resident}</h3>
                                <Badge variant="secondary">{getTypeLabel(declaration.type)}</Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span>{declaration.apartment}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Nộp: {declaration.submittedDate}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
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

                          {declaration.status === "rejected" && declaration.rejectionReason && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <p className="text-sm text-destructive">
                                <span className="font-medium">Lý do từ chối:</span> {declaration.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {declaration.status === "pending" && (
                        <div className="flex gap-2 lg:flex-col">
                          <Button size="sm" className="flex-1 lg:flex-none">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Duyệt
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1 lg:flex-none">
                            <XCircle className="h-4 w-4 mr-2" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
