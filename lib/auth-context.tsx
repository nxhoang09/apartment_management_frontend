"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { postJSON, API_URL } from "@/lib/api"
import { PowerSquare } from "lucide-react"

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Khi load trang, tự refresh token nếu có cookie refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
        })

        if (!res.ok) throw new Error("Phiên đăng nhập hết hạn")

        const data = await res.json()
        setToken(data.data.accessToken)
        setUser(data.data.user)
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

  // Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const data = await postJSON("/signin", { email, password })
      setUser(data.data.user)
      setToken(data.data.accessToken)

      switch (data.data.user.role) {
        case "ADMIN":
          router.push("/admin")
          break
        case "USER":
          router.push("/resident")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error (error.message||"Đăng nhập thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  // Đăng ký (rồi tự login)
  // const register = async (username: string, email: string, password: string) => {
  //   try {
  //     setIsLoading(true)
  //     const data = await postJSON("/signup", { username, email, password })
  //     setUser(data.data.user)
  //     setToken(data.data.accessToken)
  //     router.push("/")
  //   } catch (error) {
  //     console.error("Register error:", error)
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // Đăng xuất
  const logout = async () => {
    try {
      await postJSON("/signout", {})
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      setToken(null)
      router.push("/auth/login")
    }
  }

  //forgot-password
  const forgotPassword = async (email:string) =>{
    try{
      setIsLoading(true)
      const data = await postJSON("/forgot-password",{email})
      console.log("forgot password: ", data.data)
    } catch (error: any){
      console.error("Forgot password error:", error)
      throw new Error(error.message || "Không thể gửi email khôi phục mật khẩu")
    } finally {
      setIsLoading(false)
    }
  }

  //reset-password
  const resetPassword = async (token: string, newPassword: string) =>{
    try{
       setIsLoading(true)
      const data = await postJSON("/reset-password", { token, newPassword })
      console.log("Reset password:", data.data)
    } catch (error: any) {
      console.error("Reset password error:", error)
      throw new Error(error.message || "Đặt lại mật khẩu thất bại")
    } finally {
      setIsLoading(false)
    }
  }
  //verify-reset-token
const verifyResetToken = async (token: string) => {
  try {
    setIsLoading(true)
    const data = await postJSON("/verify-reset-token", { token })
    console.log("Verify token success:", data.data)
    return data.data
  } catch (error: any) {
    console.error("Verify token error:", error)
    throw new Error(error.message || "Token không hợp lệ hoặc đã hết hạn")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <AuthContext.Provider value={{ user, token, login, logout, forgotPassword, verifyResetToken,  resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
