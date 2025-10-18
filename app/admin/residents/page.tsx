"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, User, Building2, Phone, Mail, Filter } from "lucide-react"
import { useState } from "react"

export default function ResidentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const residents = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      idCard: "001234567890",
      phone: "0912345678",
      email: "nguyenvana@email.com",
      apartment: "A-101",
      role: "Chủ hộ",
      status: "active",
      dateOfBirth: "1985-05-15",
    },
    {
      id: 2,
      name: "Trần Thị B",
      idCard: "001234567891",
      phone: "0912345679",
      email: "tranthib@email.com",
      apartment: "A-102",
      role: "Chủ hộ",
      status: "active",
      dateOfBirth: "1990-08-20",
    },
    {
      id: 3,
      name: "Lê Văn C",
      idCard: "001234567892",
      phone: "0912345680",
      email: "levanc@email.com",
      apartment: "B-201",
      role: "Chủ hộ",
      status: "active",
      dateOfBirth: "1988-03-10",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      idCard: "001234567893",
      phone: "0912345681",
      email: "phamthid@email.com",
      apartment: "B-202",
      role: "Chủ hộ",
      status: "active",
      dateOfBirth: "1992-11-25",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      idCard: "001234567894",
      phone: "0912345682",
      email: "hoangvane@email.com",
      apartment: "A-101",
      role: "Thành viên",
      status: "active",
      dateOfBirth: "2010-06-15",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      idCard: "001234567895",
      phone: "0912345683",
      email: "vuthif@email.com",
      apartment: "A-102",
      role: "Thành viên",
      status: "temporary",
      dateOfBirth: "1995-09-30",
    },
  ]

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.apartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.idCard.includes(searchQuery),
  )

  const stats = {
    total: residents.length,
    owners: residents.filter((r) => r.role === "Chủ hộ").length,
    members: residents.filter((r) => r.role === "Thành viên").length,
    temporary: residents.filter((r) => r.status === "temporary").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý cư dân</h1>
              <p className="text-muted-foreground mt-2">Quản lý thông tin cư dân trong chung cư</p>
            </div>
            <Button className="group">
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
              Thêm cư dân
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng cư dân</p>
                    <p className="text-2xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chủ hộ</p>
                    <p className="text-2xl font-bold mt-2">{stats.owners}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Thành viên</p>
                    <p className="text-2xl font-bold mt-2">{stats.members}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tạm trú</p>
                    <p className="text-2xl font-bold mt-2">{stats.temporary}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-chart-4" />
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
                placeholder="Tìm kiếm theo tên, CMND/CCCD hoặc căn hộ..."
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

          {/* Residents Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Họ tên</th>
                      <th className="text-left p-4 font-medium text-sm">CMND/CCCD</th>
                      <th className="text-left p-4 font-medium text-sm">Căn hộ</th>
                      <th className="text-left p-4 font-medium text-sm">Vai trò</th>
                      <th className="text-left p-4 font-medium text-sm">Liên hệ</th>
                      <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-sm">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.map((resident) => (
                      <tr key={resident.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{resident.name}</p>
                              <p className="text-xs text-muted-foreground">{resident.dateOfBirth}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-mono">{resident.idCard}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{resident.apartment}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={resident.role === "Chủ hộ" ? "default" : "secondary"}>{resident.role}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{resident.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{resident.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={resident.status === "active" ? "default" : "outline"}>
                            {resident.status === "active" ? "Thường trú" : "Tạm trú"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
