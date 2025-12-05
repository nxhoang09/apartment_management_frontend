"use client"

import { useState } from "react"
import { AdminTempResidentList } from "@/components/admin/registration/AdminTempResidentList"
import { AdminTempResidentStatusList } from "@/components/admin/registration/AdminTempResidentStatusList"
import { AdminTempAbsentList } from "@/components/admin/registration/AdminTempAbsentList"
import { AdminTempAbsentStatusList } from "@/components/admin/registration/AdminTempAbsentStatusList"

export default function AdminRegistrationsPage() {
  const [activeTab, setActiveTab] = useState<"res" | "abs">("res")
  const [resInnerTab, setResInnerTab] = useState<"review" | "current" | "history" | "rejected">("review")
  const [absInnerTab, setAbsInnerTab] = useState<"review" | "current" | "history" | "rejected">("review")

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-end gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("res")}
            className={`text-2xl font-semibold pb-2 ${activeTab === "res" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            Khai báo tạm trú
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("abs")}
            className={`text-2xl font-semibold pb-2 ${activeTab === "abs" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Khai báo tạm vắng
          </button>
        </div>

        {activeTab === "res" ? (
          <section>
            <div className="p-6 bg-card border rounded-md">
              <div className="mb-4 flex items-end gap-4">
                <div className="ml-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setResInnerTab("review")}
                    className={`text-sm font-medium pb-1 ${resInnerTab === "review" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Duyệt đơn
                  </button>
                  <button
                    type="button"
                    onClick={() => setResInnerTab("current")}
                    className={`text-sm font-medium pb-1 ${resInnerTab === "current" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Hiện tại
                  </button>
                  <button
                    type="button"
                    onClick={() => setResInnerTab("history")}
                    className={`text-sm font-medium pb-1 ${resInnerTab === "history" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Lịch sử
                  </button>
                    <button
                      type="button"
                      onClick={() => setResInnerTab("rejected")}
                      className={`text-sm font-medium pb-1 ${resInnerTab === "rejected" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                    >
                      Đã từ chối
                    </button>
                </div>
              </div>

              <div className="mt-4">
                {resInnerTab === "review" && (
                  <div>
                    <AdminTempResidentList />
                  </div>
                )}
                {resInnerTab === "current" && (
                  <div>
                    <AdminTempResidentStatusList status="APPROVED" title="Đơn tạm trú đang có hiệu lực" showActions={true} />
                  </div>
                )}
                {resInnerTab === "history" && (
                  <div>
                    <AdminTempResidentStatusList status="ENDED" title="Lịch sử tạm trú" showActions={true} />
                  </div>
                )}
                {resInnerTab === "rejected" && (
                  <div>
                    <AdminTempResidentStatusList status="REJECTED" title="Đơn tạm trú đã từ chối" showActions={true} />
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section>
            <div className="p-6 bg-card border rounded-md">
              <div className="mb-4 flex items-end gap-4">
                <div className="ml-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAbsInnerTab("review")}
                    className={`text-sm font-medium pb-1 ${absInnerTab === "review" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Duyệt đơn
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbsInnerTab("current")}
                    className={`text-sm font-medium pb-1 ${absInnerTab === "current" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Hiện tại
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbsInnerTab("history")}
                    className={`text-sm font-medium pb-1 ${absInnerTab === "history" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                  >
                    Lịch sử
                  </button>
                    <button
                      type="button"
                      onClick={() => setAbsInnerTab("rejected")}
                      className={`text-sm font-medium pb-1 ${absInnerTab === "rejected" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                    >
                      Đã từ chối
                    </button>
                </div>
              </div>

              <div className="mt-4">
                {absInnerTab === "review" && (
                  <div>
                    <AdminTempAbsentList />
                  </div>
                )}
                {absInnerTab === "current" && (
                  <div>
                    <AdminTempAbsentStatusList status="APPROVED" title="Đơn tạm vắng đang có hiệu lực" showActions={true} />
                  </div>
                )}
                {absInnerTab === "history" && (
                  <div>
                    <AdminTempAbsentStatusList status="ENDED" title="Lịch sử tạm vắng" showActions={true} />
                  </div>
                )}
                  {absInnerTab === "rejected" && (
                    <div>
                      <AdminTempAbsentStatusList status="REJECTED" title="Đơn tạm vắng đã từ chối" showActions={true} />
                    </div>
                  )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
