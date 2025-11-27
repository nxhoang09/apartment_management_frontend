"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { adminGetAllHouseholds } from "@/lib/api/api"
import { useAuth } from "./auth-context"
import {io, Socket} from "socket.io-client"

const AdminContext = createContext<any>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [households, setHouseholds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const fetchHouseholds = async () => {
    if (!token) return 
    try {
      setLoading(true)
      const result = await adminGetAllHouseholds(token)
      if (result.success && result.data) {
        setHouseholds(result.data)
        localStorage.setItem("admin_households", JSON.stringify(result.data))
      }
    } catch (err) {
      console.error("Lỗi tải danh sách hộ:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return

    // Load cache trước
    const cached = localStorage.getItem("admin_households")
    if (cached) setHouseholds(JSON.parse(cached))

    fetchHouseholds()

    // Kết nối WebSocket Gateway NestJS (/admin namespace)
    const socket: Socket = io("http://localhost:3000/admin", {
      auth: { token }, 
      transports: ["websocket"], 
    })

    socket.on("connect", () => {
      console.log("Connected to Admin WebSocket", socket.id)
    })

    socket.on("disconnect", (reason) => {
      console.warn("Disconnected:", reason)
    })

    //Lắng nghe sự kiện cập nhật hộ từ server
    socket.on("household_updated", (data) => {
      console.log("household_updated:", data)
      fetchHouseholds()
    })

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  return (
    <AdminContext.Provider value={{ households, loading, refresh: fetchHouseholds }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider")
  return ctx
}
