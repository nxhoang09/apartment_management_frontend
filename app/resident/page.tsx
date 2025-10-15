import { ResidentSidebar } from "@/components/resident-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Users, FileText, Bell, Calendar, CheckCircle2, Clock } from "lucide-react"

export default function ResidentDashboard() {
  // Mock data
  const apartmentInfo = {
    code: "A-101",
    floor: 10,
    area: "85m²",
    residents: 4,
  }

  const recentAnnouncements = [
    {
      id: 1,
      title: "Thông báo bảo trì thang máy",
      date: "2025-01-05",
      type: "maintenance",
    },
    {
      id: 2,
      title: "Lịch cắt nước định kỳ",
      date: "2025-01-03",
      type: "utility",
    },
    {
      id: 3,
      title: "Họp cư dân tháng 1",
      date: "2025-01-01",
      type: "meeting",
    },
  ]

  const myDeclarations = [
    {
      id: 1,
      type: "Tạm trú",
      date: "2024-12-20",
      status: "approved",
    },
    {
      id: 2,
      type: "Tạm vắng",
      date: "2024-11-15",
      status: "approved",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <ResidentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Xin chào, Nguyễn Văn A</h1>
            <p className="text-muted-foreground mt-2">Chào mừng bạn đến với cổng thông tin cư dân</p>
          </div>

          {/* Apartment Info Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Thông tin căn hộ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Mã căn hộ</p>
                  <p className="text-2xl font-bold text-primary">{apartmentInfo.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tầng</p>
                  <p className="text-2xl font-bold">{apartmentInfo.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diện tích</p>
                  <p className="text-2xl font-bold">{apartmentInfo.area}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số cư dân</p>
                  <p className="text-2xl font-bold">{apartmentInfo.residents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Khai báo mới</h3>
                    <p className="text-sm text-muted-foreground">Tạm trú/tạm vắng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hộ gia đình</h3>
                    <p className="text-sm text-muted-foreground">Quản lý thành viên</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thông báo</h3>
                    <p className="text-sm text-muted-foreground">3 thông báo mới</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông báo mới</CardTitle>
                    <CardDescription>Thông báo từ ban quản lý</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/resident/announcements">Xem tất cả</a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{announcement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Declarations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Khai báo của tôi</CardTitle>
                    <CardDescription>Lịch sử khai báo tạm trú/tạm vắng</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/resident/declarations">Xem tất cả</a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myDeclarations.map((declaration) => (
                    <div
                      key={declaration.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            declaration.status === "approved" ? "bg-chart-4/10" : "bg-accent/10"
                          }`}
                        >
                          {declaration.status === "approved" ? (
                            <CheckCircle2 className="h-5 w-5 text-chart-4" />
                          ) : (
                            <Clock className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{declaration.type}</p>
                          <p className="text-xs text-muted-foreground">{declaration.date}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          declaration.status === "approved" ? "bg-chart-4/10 text-chart-4" : "bg-accent/10 text-accent"
                        }`}
                      >
                        {declaration.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="/resident/declarations/new">
                      <FileText className="h-4 w-4 mr-2" />
                      Tạo khai báo mới
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
