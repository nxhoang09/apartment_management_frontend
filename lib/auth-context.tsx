"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = "http://localhost:3030"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  //Khi load trang, tự check và refresh token nếu cần
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // gửi cookie refresh token
        })

        if (res.ok) {
          const data = await res.json()
          setToken(data.data.accessToken)
          setUser(data.data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth init failed:", err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  //Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // cookie chứa refresh token
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đăng nhập thất bại")
      }

      const data = await response.json()
      setUser(data.data.user)
      setToken(data.data.accessToken)

      if (data.data.user.role === "ADMIN") router.push("/admin")
      else if (data.data.user.role === "USER") router.push("/resident")
      else router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  //Register (tự login sau đăng ký)
  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đăng ký thất bại")
      }

      const data = await response.json()
      setUser(data.user)
      setToken(data.accessToken)
      router.push("/")
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  //Logout (xóa refresh token cookie ở backend)
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      setToken(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
