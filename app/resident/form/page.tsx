"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HouseholdResidentForm from "@/components/household-resident-form"

export default function RegisterHouseholdPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl">Đăng ký thông tin hộ khẩu</CardTitle>
          <CardDescription>Vui lòng điền đầy đủ thông tin chủ hộ và hộ khẩu của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <HouseholdResidentForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
