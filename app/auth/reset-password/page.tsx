"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") || ""
  const { resetPassword } = useAuth()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!token) setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.")
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.")
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess("Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập lại ngay.")
      setPassword("")
      setConfirmPassword("")

      // Tự động quay lại đăng nhập sau 3 giây
      setTimeout(() => router.push("/auth/login"), 3000)
    } catch (err: any) {
      setError(err.message || "Đặt lại mật khẩu thất bại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mật khẩu mới</CardTitle>
              <CardDescription>Vui lòng nhập và xác nhận mật khẩu mới của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !token}>
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-2">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Quay lại đăng nhập
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
