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
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = "http://localhost:3001"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // console.log("API_URL =", API_URL);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đăng nhập thất bại")
      }

      const data = await response.json()

    
      const userData: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        createtime: data.user.createtime,
      }

      setToken(data.token)
      setUser(userData)

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(userData))

      
      if (data.user.role === "ADMIN") {
        router.push("/admin")
      } else if (data.user.role === "RESIDENT") {
        router.push("/resident")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đăng ký thất bại")
      }

      const data = await response.json()

      
      const userData: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        createtime: data.user.createtime,
      }

      setToken(data.token)
      setUser(userData)

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(userData))

      
      router.push("/")
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
