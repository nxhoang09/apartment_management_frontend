"use client"

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h1>

        <p className="text-muted-foreground mb-6">Xem và chỉnh sửa thông tin cá nhân của bạn tại đây.</p>

        <div className="bg-card border border-border rounded-md p-4">
          <p className="text-sm text-muted-foreground">Nội dung thông tin cá nhân sẽ hiển thị ở đây.</p>
        </div>
      </div>
    </div>
  )
}
