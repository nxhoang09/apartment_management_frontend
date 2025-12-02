"use client"

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Cài đặt</h1>

        <p className="text-muted-foreground mb-6">Tùy chỉnh cài đặt tài khoản và ứng dụng.</p>

        <div className="bg-card border border-border rounded-md p-4">
          <p className="text-sm text-muted-foreground">Các tuỳ chọn cài đặt sẽ được hiển thị ở đây.</p>
        </div>
      </div>
    </div>
  )
}
