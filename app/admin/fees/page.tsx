"use client"

import { useEffect, useRef } from "react"
import { FeeList } from "@/components/admin/fees/fee-list"
import { FeeAssignmentList } from "@/components/admin/fees/fee-assignment-list"
import { FeeProvider, useFeeContext } from "@/lib/context/fee-context"

function FeesManagementContent() {
  const { loadFees, feesLoading, feesError } = useFeeContext()
  
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadFees()
    }
  }, [loadFees])

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Quản lý khoản phí</h1>
        <p className="text-muted-foreground">Quản lý các loại phí và theo dõi thu nộp của cư dân</p>
      </div>

      {feesError && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          Lỗi tải dữ liệu phí: {feesError}
        </div>
      )}

      <div className="space-y-8">
        {/* Phần 1: Quản lý danh sách các loại phí (CRUD) */}
        <section>
          {feesLoading ? (
            <div className="text-center py-8">Đang tải danh sách phí...</div>
          ) : (
            <FeeList />
          )}
        </section>

        {/* Phần 2: Quản lý gán phí và theo dõi thu nộp (Giao diện Tabs mới) */}
        <section>
             {/* FeeAssignmentList mới tự quản lý loading state nội bộ hoặc dùng chung fees */}
            <FeeAssignmentList />
        </section>
      </div>
    </main>
  )
}

export default function FeesManagementPage() {
  return (
    <FeeProvider>
      <FeesManagementContent />
    </FeeProvider>
  )
}