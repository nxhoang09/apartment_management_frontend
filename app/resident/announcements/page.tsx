"use client"

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Thông báo</h1>

        <p className="text-muted-foreground mb-6">Danh sách thông báo dành cho cư dân.</p>

        <div className="bg-card border border-border rounded-md p-4">
          <p className="text-sm text-muted-foreground">Chưa có thông báo nào. Thông báo sẽ xuất hiện ở đây.</p>
        </div>
      </div>
    </div>
  )
}
