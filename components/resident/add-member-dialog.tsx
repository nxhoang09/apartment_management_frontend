"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useHousehold } from "@/lib/context/household-context"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const { addMember } = useHousehold()

  const [formData, setFormData] = useState({
    fullname: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "MALE",
    relationshipToHead: "SPOUSE",
    phoneNumber: "",
    email: "",
    placeOfOrigin: "",
    occupation: "",
    workingAdress: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const memberValidationMessages = useMemo(() => ([
    { pattern: /phonenumber should not be empty/i, message: "Vui lòng nhập số điện thoại." },
    { pattern: /email should not be empty/i, message: "Vui lòng nhập email." },
    { pattern: /email must be an email/i, message: "Email không đúng định dạng." },
    { pattern: /relationshiptohead must be one of/i, message: "Vui lòng chọn quan hệ với chủ hộ hợp lệ." },
    { pattern: /placeoforigin should not be empty/i, message: "Vui lòng nhập quê quán." },
    { pattern: /occupation should not be empty/i, message: "Vui lòng nhập nghề nghiệp." },
    { pattern: /workingadress should not be empty/i, message: "Vui lòng nhập nơi làm việc." },
  ]), [])

  const getFriendlyMemberError = (err: unknown) => {
    const e: any = err ?? {}
    const payload = e?.response?.data
    const raw = payload?.message ?? payload?.error ?? e?.message ?? (typeof err === "string" ? err : "")
    const message = Array.isArray(raw) ? raw.join(", ") : String(raw || "")
    if (!message) {
      return "Không thể thêm thành viên. Vui lòng kiểm tra lại thông tin."
    }

    const matched = memberValidationMessages
      .filter((item) => item.pattern.test(message))
      .map((item) => item.message)

    if (matched.length > 0) {
      return matched.join(" ")
    }

    return message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const payload = {
      ...formData,
      fullname: formData.fullname.trim(),
      nationalId: formData.nationalId.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      relationshipToHead: formData.relationshipToHead,
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      placeOfOrigin: formData.placeOfOrigin.trim(),
      occupation: formData.occupation.trim(),
      workingAdress: formData.workingAdress.trim(),
    }

    try {
      await addMember(payload)
      setSuccess(`${formData.fullname} đã được thêm vào hộ khẩu.`)

      // Reset form và đóng dialog sau 1s
      setTimeout(() => {
        setFormData({
          fullname: "",
          nationalId: "",
          dateOfBirth: "",
          gender: "MALE",
          relationshipToHead: "SPOUSE",
          phoneNumber: "",
          email: "",
          placeOfOrigin: "",
          occupation: "",
          workingAdress: "",
        })
        onOpenChange(false)
      }, 1000)
    } catch (err) {
      const message = getFriendlyMemberError(err)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm thành viên hộ khẩu</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết của thành viên mới</DialogDescription>
        </DialogHeader>

        {/* Thông báo lỗi hoặc thành công */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên & CCCD */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên *</Label>
              <Input
                id="fullname"
                required
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">CMND/CCCD *</Label>
              <Input
                id="nationalId"
                required
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              />
            </div>
          </div>

          {/* Ngày sinh & giới tính */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quan hệ với chủ hộ */}
          <div className="space-y-2">
            <Label htmlFor="relationshipToHead">Quan hệ với chủ hộ *</Label>
            <Select
              value={formData.relationshipToHead}
              onValueChange={(value) => setFormData({ ...formData, relationshipToHead: value })}
            >
              <SelectTrigger id="relationshipToHead">
                <SelectValue placeholder="Chọn quan hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WIFE">Vợ</SelectItem>
                <SelectItem value="HUSBAND">Chồng</SelectItem>
                <SelectItem value="FATHER">Bố</SelectItem>
                <SelectItem value="MOTHER">Mẹ</SelectItem>
                <SelectItem value="SON">Con trai</SelectItem>
                <SelectItem value="DAUGHTER">Con gái</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liên hệ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Quê quán */}
          <div className="space-y-2">
            <Label htmlFor="placeOfOrigin">Quê quán</Label>
            <Input
              id="placeOfOrigin"
              required
              value={formData.placeOfOrigin}
              onChange={(e) => setFormData({ ...formData, placeOfOrigin: e.target.value })}
            />
          </div>

          {/* Nghề nghiệp & nơi làm việc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Nghề nghiệp</Label>
              <Input
                id="occupation"
                required
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workingAdress">Nơi làm việc</Label>
              <Input
                id="workingAdress"
                required
                value={formData.workingAdress}
                onChange={(e) => setFormData({ ...formData, workingAdress: e.target.value })}
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Thêm thành viên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
