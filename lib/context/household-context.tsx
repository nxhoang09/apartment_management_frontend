"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getHouseholdInfo } from "@/lib/api/api"
import { useAuth } from "@/lib/context/auth-context"

interface Household {
  id: number
  houseHoldCode: number
  apartmentNumber: string
  buildingNumber: string
  street: string
  ward: string
  province: string
  status: string
  createtime: string
  headID: number
  userID: number
}

interface HouseholdContextType {
  household: Household | null
  refreshHousehold: () => Promise<void>
  isLoading: boolean
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined)
const HOUSEHOLD_STORAGE_KEY = "household_info"

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { token, isLoading: isAuthLoading } = useAuth()
  const [household, setHousehold] = useState<Household | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearHousehold = () => {
    setHousehold(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(HOUSEHOLD_STORAGE_KEY)
    }
  }

  const refreshHousehold = async () => {
    if (!token) {
      clearHousehold()
      return
    }
    setIsLoading(true)
    try {
      const apiResult = await getHouseholdInfo(token)
      let householdData = null
      if (apiResult && apiResult.data) {
        householdData = Array.isArray(apiResult.data)
          ? apiResult.data[0]
          : apiResult.data
      }
      if (householdData) {
        setHousehold(householdData)
        if (typeof window !== "undefined") {
          localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(householdData))
        }
      } else {
        clearHousehold()
      }
    } catch (error) {
      console.error("refreshHousehold error:", error)
      clearHousehold()
    } finally {
      setIsLoading(false)
    }
  }

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(HOUSEHOLD_STORAGE_KEY)
      if (stored) {
        try {
          setHousehold(JSON.parse(stored))
        } catch {
          setHousehold(null)
        }
      }
    }
  }, [])

  
  useEffect(() => {
    if (isAuthLoading) return // Chờ AuthProvider load xong
    if (!token) {
      clearHousehold()
      setIsLoading(false)
      return
    }
    refreshHousehold()
  }, [token, isAuthLoading])

  return (
    <HouseholdContext.Provider value={{ household, refreshHousehold, isLoading }}>
      {children}
    </HouseholdContext.Provider>
  )
}

export function useHousehold() {
  const context = useContext(HouseholdContext)
  if (!context) throw new Error("useHousehold must be used within a HouseholdProvider")
  return context
}
