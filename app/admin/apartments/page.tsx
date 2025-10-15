"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Plus, Users, Home, Filter } from "lucide-react"
import { useState } from "react"

export default function ApartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const apartments = [
    {
      id: 1,
      code: "A-101",
      floor: 10,
      area: 85,
      status: "occupied",
      owner: "Nguyễn Văn A",
      residents: 4,
      image: "/images/apartment-1.jpg",
    },
    {
      id: 2,
      code: "A-102",
      floor: 10,
      area: 85,
      status: "occupied",
      owner: "Trần Thị B",
      residents: 3,
      image: "/images/apartment-2.jpg",
    },
    {
      id: 3,
      code: "A-103",
      floor: 10,
      area: 90,
      status: "vacant",
      owner: null,
      residents: 0,
      image: "/images/apartment-3.jpg",
    },
    {
      id: 4,
      code: "B-201",
      floor: 20,
      area: 120,
      status: "rented",
      owner: "Lê Văn C",
      residents: 5,
      image: "/images/apartment-4.jpg",
    },
    {
      id: 5,
      code: "B-202",
      floor: 20,
      area: 120,
      status: "occupied",
      owner: "Phạm Thị D",
      residents: 2,
      image: "/images/apartment-5.jpg",
    },
    {
      id: 6,
      code: "C-301",
      floor: 30,
      area: 150,
      status: "vacant",
      owner: null,
      residents: 0,
      image: "/images/apartment-6.jpg",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      occupied: { label: "Đang ở", variant: "default" as const },
      vacant: { label: "Trống", variant: "secondary" as const },
      rented: { label: "Cho thuê", variant: "outline" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.occupied
  }

  const filteredApartments = apartments.filter(
    (apt) =>
      apt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.owner?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: apartments.length,
    occupied: apartments.filter((a) => a.status === "occupied").length,
    vacant: apartments.filter((a) => a.status === "vacant").length,
    rented: apartments.filter((a) => a.status === "rented").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý căn hộ</h1>
              <p className="text-muted-foreground mt-2">Quản lý thông tin các căn hộ trong chung cư</p>
            </div>
            <Button className="group">
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
              Thêm căn hộ
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng căn hộ</p>
                    <p className="text-2xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Đang ở</p>
                    <p className="text-2xl font-bold mt-2">{stats.occupied}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <Home className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trống</p>
                    <p className="text-2xl font-bold mt-2">{stats.vacant}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cho thuê</p>
                    <p className="text-2xl font-bold mt-2">{stats.rented}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
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
                placeholder="Tìm kiếm theo mã căn hộ hoặc chủ hộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Apartments Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApartments.map((apartment) => {
              const statusBadge = getStatusBadge(apartment.status)
              return (
                <Card
                  key={apartment.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={apartment.image || "/placeholder.svg"}
                      alt={apartment.code}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{apartment.code}</h3>
                      <p className="text-sm text-muted-foreground">Tầng {apartment.floor}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Diện tích</p>
                        <p className="font-semibold">{apartment.area}m²</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cư dân</p>
                        <p className="font-semibold">{apartment.residents} người</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Chủ hộ</p>
                      <p className="font-medium">{apartment.owner || "Chưa có"}</p>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      Xem chi tiết
                    </Button>
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
