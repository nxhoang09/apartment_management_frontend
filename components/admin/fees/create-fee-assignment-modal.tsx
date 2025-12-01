"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFeeContext } from "@/lib/context/fee-context"
import { useAdmin } from "@/lib/context/admin-context"

interface CreateFeeAssignmentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateFeeAssignmentModal({ onClose, onSuccess }: CreateFeeAssignmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { households, loading: loadingData } = useAdmin()
  const { fees, createAssignment } = useFeeContext()
  
  const [selectedFeeId, setSelectedFeeId] = useState("")
  const [dueDate, setDueDate] = useState("") // State cho ngày hết hạn
  const [selectedHouseholds, setSelectedHouseholds] = useState(new Set<number>())

  // Logic lọc hộ dân (như cũ)
  const filteredHouseholds = useMemo(() => {
    if (!households) return []
    const query = searchQuery.toLowerCase().trim()
    if (!query) return households
    return households.filter((h: any) => {
      const headName = h.resident?.find((r: any) => r.relationshipToHead === "HEAD")?.fullname || ""
      return (
        h.houseHoldCode.toString().includes(query) ||
        h.apartmentNumber.toLowerCase().includes(query) ||
        headName.toLowerCase().includes(query)
      )
    })
  }, [households, searchQuery])

  const handleHouseholdToggle = (id: number) => {
    const next = new Set(selectedHouseholds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedHouseholds(next)
  }

  const isAllSelected = filteredHouseholds.length > 0 && filteredHouseholds.every((h: any) => selectedHouseholds.has(h.id))
  
  const handleSelectAll = () => {
    const next = new Set(selectedHouseholds)
    if (isAllSelected) {
      filteredHouseholds.forEach((h: any) => next.delete(h.id))
    } else {
      filteredHouseholds.forEach((h: any) => next.add(h.id))
    }
    setSelectedHouseholds(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFeeId) return toast.error("Vui lòng chọn khoản phí")
    if (!dueDate) return toast.error("Vui lòng chọn hạn nộp") // Validate
    if (selectedHouseholds.size === 0) return toast.error("Vui lòng chọn ít nhất một hộ")

    setLoading(true)
    try {
      await createAssignment({
        feeId: Number(selectedFeeId),
        householdIds: Array.from(selectedHouseholds),
        dueDate: new Date(dueDate).toISOString(), // Format ISO
      })
      toast.success("Thành công", { description: `Đã gán phí cho ${selectedHouseholds.size} hộ` })
      onSuccess()
    } catch (error) {
      toast.error("Lỗi", { description: error instanceof Error ? error.message : "Lỗi không xác định" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gán phí cho hộ</DialogTitle>
          <DialogDescription>Chọn khoản phí, hạn nộp và các hộ dân</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            {/* 1. Chọn khoản phí */}
            <div className="space-y-2">
              <Label>Chọn khoản phí *</Label>
              <Select value={selectedFeeId} onValueChange={setSelectedFeeId}>
                <SelectTrigger><SelectValue placeholder="Chọn loại phí" /></SelectTrigger>
                <SelectContent>
                  {fees.map((fee) => (
                    <SelectItem key={fee.id} value={fee.id.toString()}>
                      {fee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Chọn hạn nộp */}
            <div className="space-y-2">
              <Label>Hạn nộp *</Label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* 3. Danh sách hộ dân */}
          <div className="flex-1 flex flex-col min-h-0 space-y-2">
            <Label>Chọn hộ dân ({selectedHouseholds.size} đã chọn)</Label>
            <Input 
              placeholder="Tìm theo mã hộ, số phòng, tên chủ hộ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            
            <div className="border rounded-lg flex-1 flex flex-col min-h-0">
              <div className="flex items-center space-x-2 p-3 border-b bg-muted/40">
                <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
                <Label htmlFor="select-all" className="cursor-pointer font-medium">
                  {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả danh sách dưới"}
                </Label>
              </div>

              <ScrollArea className="flex-1 p-3 h-64">
                <div className="space-y-3">
                  {loadingData ? <p className="text-center py-4">Đang tải...</p> : 
                   filteredHouseholds.map((h: any) => {
                     const headName = h.resident?.find((r: any) => r.relationshipToHead === "HEAD")?.fullname || ""
                     return (
                        <div key={h.id} className="flex items-center space-x-2 hover:bg-accent/50 p-1 rounded">
                          <Checkbox
                            id={`h-${h.id}`}
                            checked={selectedHouseholds.has(h.id)}
                            onCheckedChange={() => handleHouseholdToggle(h.id)}
                          />
                          <Label htmlFor={`h-${h.id}`} className="flex-1 cursor-pointer">
                            <span className="font-medium">{h.apartmentNumber} - {h.buildingNumber}</span>
                            {headName && <span className="text-muted-foreground ml-2">({headName})</span>}
                          </Label>
                        </div>
                     )
                   })
                  }
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Gán phí"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}