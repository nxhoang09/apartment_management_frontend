import { AdminSidebar } from "@/components/admin-sidebar"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - will be replaced with real data
  const stats = {
    totalApartments: 500,
    occupiedApartments: 432,
    totalResidents: 1248,
    pendingDeclarations: 12,
  }

  const recentDeclarations = [
    {
      id: 1,
      resident: "Nguyễn Văn A",
      apartment: "A-101",
      type: "Tạm trú",
      date: "2025-01-05",
      status: "pending",
    },
    {
      id: 2,
      resident: "Trần Thị B",
      apartment: "B-205",
      type: "Tạm vắng",
      date: "2025-01-04",
      status: "approved",
    },
    {
      id: 3,
      resident: "Lê Văn C",
      apartment: "C-310",
      type: "Tạm trú",
      date: "2025-01-03",
      status: "pending",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Tổng quan</h1>
            <p className="text-muted-foreground mt-2">Xem tổng quan về tình hình chung cư</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng căn hộ"
              value={stats.totalApartments}
              description={`${stats.occupiedApartments} đang có người ở`}
              icon={Building2}
              trend={{ value: 2.5, isPositive: true }}
            />
            <StatCard
              title="Căn hộ đang ở"
              value={stats.occupiedApartments}
              description={`${((stats.occupiedApartments / stats.totalApartments) * 100).toFixed(1)}% công suất`}
              icon={CheckCircle2}
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatCard
              title="Tổng cư dân"
              value={stats.totalResidents}
              description="Đang sinh sống"
              icon={Users}
              trend={{ value: 3.1, isPositive: true }}
            />
            <StatCard
              title="Khai báo chờ duyệt"
              value={stats.pendingDeclarations}
              description="Cần xử lý"
              icon={FileText}
              trend={{ value: -12.5, isPositive: false }}
            />
          </div>

          {/* Recent Declarations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Khai báo gần đây</CardTitle>
                  <CardDescription>Danh sách khai báo tạm trú/tạm vắng mới nhất</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/declarations">Xem tất cả</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeclarations.map((declaration) => (
                  <div
                    key={declaration.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          declaration.status === "pending" ? "bg-accent/10" : "bg-chart-4/10"
                        }`}
                      >
                        {declaration.status === "pending" ? (
                          <Clock className="h-5 w-5 text-accent" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-chart-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{declaration.resident}</p>
                        <p className="text-sm text-muted-foreground">
                          {declaration.apartment} • {declaration.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{declaration.date}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          declaration.status === "pending" ? "bg-accent/10 text-accent" : "bg-chart-4/10 text-chart-4"
                        }`}
                      >
                        {declaration.status === "pending" ? "Chờ duyệt" : "Đã duyệt"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thêm căn hộ</h3>
                    <p className="text-sm text-muted-foreground">Tạo căn hộ mới</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thêm cư dân</h3>
                    <p className="text-sm text-muted-foreground">Đăng ký cư dân mới</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gửi thông báo</h3>
                    <p className="text-sm text-muted-foreground">Thông báo cho cư dân</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
