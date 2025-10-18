"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
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

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshHousehold = async () => {
    setIsLoading(true)
    try {
      console.log("refreshHousehold called, token:", token)
      if (!token) {
        setHousehold(null)
        setIsLoading(false)
        return
      }
      const data = await getHouseholdInfo(token)
      console.log("API household data:", data)
      setHousehold(data || null)
    } catch (error) {
      console.error("Error getHouseholdInfo:", error)
      setHousehold(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      refreshHousehold()
    } else {
      setHousehold(null)
      setIsLoading(false)
    }
  }, [token])

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