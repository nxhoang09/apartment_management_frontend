"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createHouseholdAndHead } from "@/lib/api/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/context/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"

export default function HouseholdResidentForm({
  initialData,
  onSuccess,
  mode = "create",
}: {
  initialData?: any
  onSuccess?: () => void
  mode?: "create" | "edit"
}) {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState(
    initialData || {
      household: {
        houseHoldCode: "",
        apartmentNumber: "",
        buildingNumber: "",
        street: "",
        ward: "",
        province: "",
      },
      resident: {
        nationalId: "",
        phoneNumber: "",
        email: "",
        fullname: "",
        dateOfBirth: "",
        gender: "MALE",
        relationshipToHead: "HEAD",
        placeOfOrigin: "",
        occupation: "",
        workingAdress: "",
        houseHoldId: undefined,
      },
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const [group, field] = name.split(".")
    setFormData((prev: typeof formData) => ({
      ...prev,
      [group as "household" | "resident"]: {
        ...prev[group as "household" | "resident"],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      if (!token) {
        setError("Bạn cần đăng nhập!")
        setIsLoading(false)
        return
      }
      const submitData = {
        ...formData,
        household: {
          ...formData.household,
          houseHoldCode: formData.household.houseHoldCode === "" ? 0 : Number(formData.household.houseHoldCode),
        },
      }
      await createHouseholdAndHead(submitData, token)
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/resident")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký hộ khẩu thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Household Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Thông tin hộ khẩu</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="household.houseHoldCode">Mã hộ khẩu</Label>
              <Input
                id="household.houseHoldCode"
                name="household.houseHoldCode"
                value={formData.household.houseHoldCode}
                onChange={handleChange}
                placeholder="Nhập mã hộ khẩu"
                type="number"
                required
              />
            </div>
            <div>
              <Label htmlFor="household.apartmentNumber">Số căn hộ</Label>
              <Input
                id="household.apartmentNumber"
                name="household.apartmentNumber"
                value={formData.household.apartmentNumber}
                onChange={handleChange}
                placeholder="VD: A-101"
                required
              />
            </div>
            <div>
              <Label htmlFor="household.buildingNumber">Tòa nhà</Label>
              <Input
                id="household.buildingNumber"
                name="household.buildingNumber"
                value={formData.household.buildingNumber}
                onChange={handleChange}
                placeholder="VD: Tòa A"
                required
              />
            </div>
            <div>
              <Label htmlFor="household.street">Đường</Label>
              <Input
                id="household.street"
                name="household.street"
                value={formData.household.street}
                onChange={handleChange}
                placeholder="Nhập tên đường"
                required
              />
            </div>
            <div>
              <Label htmlFor="household.ward">Phường</Label>
              <Input
                id="household.ward"
                name="household.ward"
                value={formData.household.ward}
                onChange={handleChange}
                placeholder="Nhập phường"
                required
              />
            </div>
            <div>
              <Label htmlFor="household.province">Tỉnh/Thành phố</Label>
              <Input
                id="household.province"
                name="household.province"
                value={formData.household.province}
                onChange={handleChange}
                placeholder="Nhập tỉnh/thành phố"
                required
              />
            </div>
          </div>
        </div>

        {/* Household Head Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Thông tin chủ hộ</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="resident.fullname">Họ và tên</Label>
              <Input
                id="resident.fullname"
                name="resident.fullname"
                value={formData.resident.fullname}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.nationalId">CMND/CCCD</Label>
              <Input
                id="resident.nationalId"
                name="resident.nationalId"
                value={formData.resident.nationalId}
                onChange={handleChange}
                placeholder="Nhập số CMND/CCCD"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.dateOfBirth">Ngày sinh</Label>
              <Input
                id="resident.dateOfBirth"
                name="resident.dateOfBirth"
                value={formData.resident.dateOfBirth}
                onChange={handleChange}
                type="date"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.gender">Giới tính</Label>
              <select
                id="resident.gender"
                name="resident.gender"
                value={formData.resident.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>
            <div>
              <Label htmlFor="resident.phoneNumber">Số điện thoại</Label>
              <Input
                id="resident.phoneNumber"
                name="resident.phoneNumber"
                value={formData.resident.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.email">Email</Label>
              <Input
                id="resident.email"
                name="resident.email"
                value={formData.resident.email}
                onChange={handleChange}
                placeholder="Nhập email"
                type="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.placeOfOrigin">Quê quán</Label>
              <Input
                id="resident.placeOfOrigin"
                name="resident.placeOfOrigin"
                value={formData.resident.placeOfOrigin}
                onChange={handleChange}
                placeholder="Nhập quê quán"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.occupation">Nghề nghiệp</Label>
              <Input
                id="resident.occupation"
                name="resident.occupation"
                value={formData.resident.occupation}
                onChange={handleChange}
                placeholder="Nhập nghề nghiệp"
                required
              />
            </div>
            <div>
              <Label htmlFor="resident.workingAdress">Nơi làm việc</Label>
              <Input
                id="resident.workingAdress"
                name="resident.workingAdress"
                value={formData.resident.workingAdress}
                onChange={handleChange}
                placeholder="Nhập nơi làm việc"
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full mt-6">
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isLoading ? "Đang xử lý..." : mode === "edit" ? "Cập nhật" : "Đăng ký"}
      </Button>
    </form>
  )
}
