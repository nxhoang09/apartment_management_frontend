"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/context/auth-context"
import { apiRequest } from "@/lib/api/api"

interface UserAccount {
  id: number
  username: string
  email: string
  role: string
  state: "INACTIVE" | "ACTIVE" | "DELETED"
  HouseHolds?: {
    apartmentNumber: string
    head?: {
      fullname: string
    }
  }
}

interface ApiResponseData {
  items: UserAccount[]
  total: number
  page: number
  limit: number
  totalPages: number
}
interface ApiResponse {
  data: ApiResponseData
}

export default function AccountsAndApartmentsPage() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<"accounts" | "apartments">("accounts")
  const [searchTerm, setSearchTerm] = useState("")
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [createCount, setCreateCount] = useState<number>(1)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createLoading, setCreateLoading] = useState(false)

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest(`/user/all?page=${page}&limit=${limit}`, "GET", undefined, token)
      const data = res as ApiResponse
      const inner = data.data
      setAccounts(inner.items || [])
      setTotal(Number(inner.total || 0))
      const pagesFromApi = Number(inner?.totalPages)
      const apiLimit = Number(inner?.limit)
      const effectiveLimit = Number.isFinite(apiLimit) && apiLimit > 0 ? apiLimit : limit
      const computed = Math.max(1, Math.ceil(Number(inner.total || 0) / effectiveLimit))
      const nextPages = Number.isFinite(pagesFromApi) && pagesFromApi > 0 ? pagesFromApi : computed
      const willDisableNext = page >= nextPages
      setTotalPages(nextPages)
      if (page > nextPages) {
        // Clamp current page if it exceeds new total pages
        setPage(nextPages)
      }
    } catch (err: any) {
      setError(err?.message ?? "Không thể tải danh sách tài khoản")
    } finally {
      setLoading(false)
    }
  }, [token, page, limit])

  

  useEffect(() => {
    if (token) {
      void loadAccounts()
    }
  }, [token, loadAccounts])

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // totalPages is maintained from API (with fallback), so no local recompute here

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAccounts.map(acc => acc.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectId = (id: number, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    
    setLoading(true)
    setError(null)
    try {
      await apiRequest("/user/delete", "DELETE", { ids: Array.from(selectedIds) }, token)
      setSelectedIds(new Set())
      setConfirmDeleteOpen(false)
      await loadAccounts()
    } catch (err: any) {
      setError(err?.message ?? "Không thể xóa tài khoản")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(true)
  }

  const handleCreateAccounts = async () => {
    setCreateError(null)
    if (!createCount || createCount < 1) {
      setCreateError("Số lượng phải >= 1")
      return
    }
    if (createCount > 50) {
      setCreateError("Chỉ tạo tối đa 50 tài khoản một lần")
      return
    }
    setCreateLoading(true)
    try {
      await apiRequest("/user/create-accounts", "POST", { num: createCount }, token)
      setCreateOpen(false)
      setCreateCount(1)
      await loadAccounts()
    } catch (err: any) {
      setCreateError(err?.message ?? "Không thể tạo tài khoản")
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-4 px-8">
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`py-2 px-1 border-b-2 font-semibold text-2xl ${
              activeTab === "accounts"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Danh sách tài khoản
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "accounts" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tài khoản ({total})</CardTitle>
              <Button onClick={() => setCreateOpen(true)}>+ Tạo tài khoản mới</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Tìm kiếm theo username hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            {!loading && selectedIds.size > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Đã chọn: {selectedIds.size}</span>
                <Button variant="destructive" size="sm" onClick={handleConfirmDelete}>
                  Xóa ({selectedIds.size})
                </Button>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn chắc chắn muốn xóa {selectedIds.size} tài khoản? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)} disabled={loading}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected} disabled={loading}>
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
              </div>
            )}

            {loading && <div>Đang tải...</div>}
            {!loading && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedIds.size > 0 && selectedIds.size === filteredAccounts.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Căn hộ</TableHead>
                      <TableHead>Chủ hộ</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => {
                      const apartment = account.HouseHolds
                      const apartmentNumber = apartment?.apartmentNumber
                      const ownerName = apartment?.head?.fullname
                      return (
                        <TableRow key={account.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(account.id)}
                              onChange={(e) => handleSelectId(account.id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>{account.email}</TableCell>
                          <TableCell>{account.role === "ADMIN" ? "Quản trị viên" : "Cư dân"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-sm ${
                              account.state === "ACTIVE" ? "bg-green-100 text-green-800" :
                              account.state === "INACTIVE" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {account.state === "ACTIVE" ? "Hoạt động" :
                               account.state === "INACTIVE" ? "Không hoạt động" :
                               "Đã xóa"}
                            </span>
                          </TableCell>
                          <TableCell>{apartmentNumber ? `Căn ${apartmentNumber}` : "-"}</TableCell>
                          <TableCell>{ownerName ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {!loading && filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Không tìm thấy tài khoản nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && accounts.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Số hàng:</span>
                  {[10, 15, 20].map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === limit ? undefined : "outline"}
                      onClick={() => {
                        setLimit(n)
                        setPage(1)
                      }}
                    >
                      {n}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1
                      return (
                        <Button
                          key={p}
                          size="sm"
                          variant={p === page ? undefined : "outline"}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo tài khoản mới</DialogTitle>
            <DialogDescription>Nhập số lượng tài khoản muốn tạo (tối đa 50).</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="account-count">Số lượng</Label>
              <Input
                id="account-count"
                type="number"
                min={1}
                max={50}
                value={createCount}
                onChange={(e) => setCreateCount(Number(e.target.value))}
              />
              {createError && <div className="text-sm text-destructive">{createError}</div>}
            </div>
          </div>

          <DialogFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={createLoading}>Hủy</Button>
            <Button onClick={handleCreateAccounts} disabled={createLoading}>
              {createLoading ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
