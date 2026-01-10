"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { postJSON, API_URL } from "@/lib/api/api"

interface User {
  id: number
  username: string
  email: string
  role: string
  createtime: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  verifyResetToken: (token: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  isLoading: boolean
}

type FriendlyOverride = Partial<Record<"unauthorized" | "forbidden" | "notFound" | "conflict", string>>

const extractErrorMeta = (err: unknown) => {
  const error: any = err ?? {}
  const status = error?.status ?? error?.response?.status ?? error?.statusCode
  const payload = error?.response?.data
  const messageSource = payload?.message ?? payload?.error ?? error?.message ?? (typeof err === "string" ? err : undefined)
  const normalizedSource = Array.isArray(messageSource) ? messageSource[0] : messageSource
  const message = typeof normalizedSource === "string" ? normalizedSource : undefined
  return { status, message }
}

const getFriendlyErrorMessage = (err: unknown, fallback: string, overrides: FriendlyOverride = {}) => {
  const { status, message } = extractErrorMeta(err)
  const normalized = (message ?? "").toLowerCase()

  if (/failed to fetch|network error|network request failed/.test(normalized)) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại."
  }

  if (status === 401 || /unauthoriz|invalid credential|sai\s+mat\s+khau/.test(normalized)) {
    return overrides.unauthorized || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
  }

  if (status === 403 || /forbidden|không\s+có\s+quyền/.test(normalized)) {
    return overrides.forbidden || "Bạn không có quyền thực hiện hành động này."
  }

  if (status === 404 || /not\s+found|không\s+tìm\s+thấy/.test(normalized)) {
    return overrides.notFound || "Không tìm thấy dữ liệu phù hợp."
  }

  if (status === 409 || /conflict|đã\s+tồn\s+tại/.test(normalized)) {
    return overrides.conflict || "Dữ liệu đã tồn tại."
  }

  if (/password/.test(normalized) && /match|không\s+khớp/.test(normalized)) {
    return "Mật khẩu nhập vào không hợp lệ."
  }

  if (message) {
    return message
  }

  return fallback
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!res.ok) throw new Error("Phiên đăng nhập hết hạn")

        const json = await res.json()
        const payload = json.data || json 

        setToken(payload.accessToken)
        setUser(payload.user)
      } catch (err) {
        console.error("Auth init failed:", err)
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await postJSON("/auth/signin", { email, password })
      const payload = response?.data ?? response
      const authenticatedUser = payload?.user
      const accessToken = payload?.accessToken

      if (!authenticatedUser || !accessToken) {
        throw new Error("Không thể lấy thông tin đăng nhập từ máy chủ.")
      }

      setUser(authenticatedUser)
      setToken(accessToken)

      switch (authenticatedUser.role) {
        case "ADMIN":
          router.push("/admin")
          break
        case "USER":
          router.push("/resident")
          break
        case "ACCOUNTANT":
          router.push("/accountant")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const friendly = getFriendlyErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại.", {
        unauthorized: "Email hoặc mật khẩu chưa chính xác.",
        notFound: "Không tìm thấy tài khoản với thông tin này."
      })
      throw new Error(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await postJSON("/auth/signout", {})
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      setToken(null)
      router.push("/auth/login")
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true)
      const data = await postJSON("/auth/forgot-password", { email })
      console.log("forgot password:", data.data)
    } catch (error: any) {
      console.error("Forgot password error:", error)
      const friendly = getFriendlyErrorMessage(error, "Không thể gửi email khôi phục mật khẩu.", {
        notFound: "Không tìm thấy tài khoản với email này."
      })
      throw new Error(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true)
      const data = await postJSON("/auth/reset-password", { token, newPassword })
      console.log("Reset password:", data.data)
    } catch (error: any) {
      console.error("Reset password error:", error)
      const friendly = getFriendlyErrorMessage(error, "Đặt lại mật khẩu thất bại.", {
        unauthorized: "Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ."
      })
      throw new Error(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyResetToken = async (token: string) => {
    try {
      setIsLoading(true)
      const data = await postJSON("/auth/verify-reset-token", { token })
      console.log("Verify token success:", data.data)
      return data.data
    } catch (error: any) {
      console.error("Verify token error:", error)
      const friendly = getFriendlyErrorMessage(error, "Token không hợp lệ hoặc đã hết hạn.", {
        unauthorized: "Liên kết đặt lại đã hết hạn, vui lòng yêu cầu lại email khôi phục.",
        notFound: "Không tìm thấy thông tin xác thực của liên kết này."
      })
      throw new Error(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, forgotPassword, verifyResetToken, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}


