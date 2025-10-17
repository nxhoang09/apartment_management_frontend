"use client"

import type React from "react"

import { ResidentSidebar } from "@/components/resident-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewDeclarationPage() {
  const [formData, setFormData] = useState({
    type: "temporary_residence",
    startDate: "",
    endDate: "",
    reason: "",
    personName: "",
    personIdCard: "",
    personPhone: "",
    relationship: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Declaration submitted:", formData)
    // TODO: Implement submission logic
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ResidentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/resident/declarations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Tạo khai báo mới</h1>
            <p className="text-muted-foreground mt-2">Điền thông tin để tạo khai báo tạm trú hoặc tạm vắng</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Thông tin khai báo
              </CardTitle>
              <CardDescription>Vui lòng điền đầy đủ và chính xác thông tin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Declaration Type */}
                <div className="space-y-3">
                  <Label>Loại khai báo</Label>
                  <RadioGroup value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="temporary_residence" id="temporary_residence" />
                      <Label htmlFor="temporary_residence" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Tạm trú</p>
                          <p className="text-sm text-muted-foreground">Đăng ký người đến ở tạm thời</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="temporary_absence" id="temporary_absence" />
                      <Label htmlFor="temporary_absence" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Tạm vắng</p>
                          <p className="text-sm text-muted-foreground">Thông báo vắng mặt tạm thời</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Time Period */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Person Information (for temporary residence) */}
                {formData.type === "temporary_residence" && (
                  <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
                    <h3 className="font-semibold">Thông tin người tạm trú</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="personName">Họ và tên</Label>
                        <Input
                          id="personName"
                          value={formData.personName}
                          onChange={(e) => handleChange("personName", e.target.value)}
                          placeholder="Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personIdCard">CMND/CCCD</Label>
                        <Input
                          id="personIdCard"
                          value={formData.personIdCard}
                          onChange={(e) => handleChange("personIdCard", e.target.value)}
                          placeholder="001234567890"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personPhone">Số điện thoại</Label>
                        <Input
                          id="personPhone"
                          value={formData.personPhone}
                          onChange={(e) => handleChange("personPhone", e.target.value)}
                          placeholder="0912345678"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Quan hệ</Label>
                        <Input
                          id="relationship"
                          value={formData.relationship}
                          onChange={(e) => handleChange("relationship", e.target.value)}
                          placeholder="Bạn bè, người thân..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    placeholder="Nhập lý do khai báo..."
                    rows={4}
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/resident/declarations">Hủy</Link>
                  </Button>
                  <Button type="submit" className="flex-1">
                    Gửi khai báo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
