"use client"

import { useState } from "react"
import { FeeList } from "@/components/admin/fees/fee-list"
import { FeeAssignmentList } from "@/components/admin/fees/fee-assignment-list"
import { FeeProvider, useFeeContext } from "@/lib/context/fee-context"

function FeesManagementContent() {
  const { feesError } = useFeeContext()
  const [activeTab, setActiveTab] = useState<"fee-types" | "fee-collection">("fee-types")

  return (
    <main className="container mx-auto py-4 px-8">
      {feesError && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          Lỗi tải dữ liệu phí: {feesError}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("fee-types")}
            className={`py-2 px-1 border-b-2 font-semibold text-2xl ${
              activeTab === "fee-types"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Danh sách các loại phí
          </button>
          <button
            onClick={() => setActiveTab("fee-collection")}
            className={`py-2 px-1 border-b-2 font-semibold text-2xl ${
              activeTab === "fee-collection"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Quản lý thu phí
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === "fee-types" && (
          <section>
            <FeeList />
          </section>
        )}

        {activeTab === "fee-collection" && (
          <section>
            <FeeAssignmentList />
          </section>
        )}
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