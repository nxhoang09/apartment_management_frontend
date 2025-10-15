"use client"

import { ResidentSidebar } from "@/components/resident-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Edit } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock data
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn A",
    idCard: "001234567890",
    dateOfBirth: "1985-05-15",
    phone: "0912345678",
    email: "nguyenvana@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    apartment: "A-101",
    role: "Chủ hộ",
    moveInDate: "2020-01-15",
  })

  const familyMembers = [
    {
      id: 1,
      name: "Nguyễn Thị B",
      relationship: "Vợ",
      dateOfBirth: "1987-08-20",
      idCard: "001234567891",
    },
    {
      id: 2,
      name: "Nguyễn Văn C",
      relationship: "Con",
      dateOfBirth: "2010-03-15",
      idCard: "001234567892",
    },
    {
      id: 3,
      name: "Nguyễn Thị D",
      relationship: "Con",
      dateOfBirth: "2015-06-20",
      idCard: "001234567893",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <ResidentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
              <p className="text-muted-foreground mt-2">Quản lý thông tin cá nhân và hộ gia đình</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </Button>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin cơ bản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input id="fullName" value={profile.fullName} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCard">CMND/CCCD</Label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <Input id="idCard" value={profile.idCard} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input id="dateOfBirth" type="date" value={profile.dateOfBirth} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input id="phone" value={profile.phone} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={profile.email} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Ngày chuyển đến</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input id="moveInDate" type="date" value={profile.moveInDate} disabled />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ hộ khẩu</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input id="address" value={profile.address} disabled={!isEditing} />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Lưu thay đổi</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Thành viên hộ gia đình</CardTitle>
                  <CardDescription>Danh sách các thành viên trong hộ gia đình</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Thêm thành viên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.relationship} • {member.dateOfBirth}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{member.idCard}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
