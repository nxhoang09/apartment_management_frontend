"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { getHouseholdInfo, getHouseholdMembers, addHouseholdMember, updateHouseHoldMember, deleteHouseHoldMember } from "@/lib/api/api"
import { useAuth } from "@/lib/context/auth-context"

export interface ResidentMember {
  id: number
  nationalId: string
  phoneNumber: string
  email: string
  fullname: string
  dateOfBirth: string
  gender: string
  relationshipToHead: string
  placeOfOrigin: string
  occupation: string
  workingAdress: string
  residencStatus: string
  houseHoldId: number
}

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
  members: ResidentMember[]
  refreshMembers: () => Promise<void>
  addMember: (data: any) => Promise<void>
  updateMember: (residentId: number, data: Partial<ResidentMember>) => Promise<void>
  deleteMember: (residentId: string) => Promise<void>
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined)
const HOUSEHOLD_STORAGE_KEY = "household_info"
const MEMBERS_STORAGE_KEY = "household_members"

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { token, isLoading: isAuthLoading } = useAuth()
  const [household, setHousehold] = useState<Household | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<ResidentMember[]>([])
  const hasFetchedMembers = useRef(false)

  const clearHousehold = () => {
    setHousehold(null)
    if (typeof window !== "undefined") localStorage.removeItem(HOUSEHOLD_STORAGE_KEY)
  }

  const clearMembers = () => {
    setMembers([])
    if (typeof window !== "undefined") localStorage.removeItem(MEMBERS_STORAGE_KEY)
  }

  const refreshHousehold = async () => {
    if (!token) {
      clearHousehold()
      return
    }
    setIsLoading(true)
    try {
      const apiResult = await getHouseholdInfo(token)
      let householdData = Array.isArray(apiResult?.data) ? apiResult.data[0] : apiResult.data
      if (householdData) {
        // Chỉ cập nhật nếu khác với giá trị cũ
        if (JSON.stringify(householdData) !== JSON.stringify(household)) {
          setHousehold(householdData)
          if (typeof window !== "undefined") {
            localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(householdData))
          }
          hasFetchedMembers.current = false // household thay đổi -> cho phép fetch lại members
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

  const refreshMembers = async () => {
    if (!token || !household?.id) {
      clearMembers()
      return
    }
    try {
      const apiResult = await getHouseholdMembers(token)
      if (apiResult && Array.isArray(apiResult.data)) {
        setMembers(apiResult.data)
        if (typeof window !== "undefined") {
          localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(apiResult.data))
        }
      } else {
        clearMembers()
      }
    } catch (error) {
      console.error("refreshMembers error:", error)
      clearMembers()
    }
  }
  const addMember = async(data: any) =>{
    if (!token) throw new Error("Chưa đăng nhập");
    await addHouseholdMember(data, token);
    await refreshMembers();
  }
  const updateMember = async(residentId: number, data: Partial<ResidentMember>) =>{
    if(!token) throw new Error("Chưa đăng nhập");
    await updateHouseHoldMember(residentId, data, token);
    await refreshMembers();
  } 
  const deleteMember = async (residentId: string) => {
    if (!token) throw new Error("Chưa đăng nhập");
    await deleteHouseHoldMember(Number(residentId), token);
    await refreshMembers();
  }

  // load household từ localStorage lần đầu
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

  // gọi API household khi có token
  useEffect(() => {
    if (isAuthLoading) return
    if (!token) {
      clearHousehold()
      setIsLoading(false)
      return
    }
    refreshHousehold()
  }, [token, isAuthLoading])

  // chỉ fetch members một lần sau khi household có dữ liệu
  useEffect(() => {
    if (!isAuthLoading && household && token && !hasFetchedMembers.current) {
      hasFetchedMembers.current = true
      refreshMembers()
    }
  }, [household, token, isAuthLoading])

  return (
    <HouseholdContext.Provider
      value={{
        household,
        refreshHousehold,
        isLoading,
        members,
        refreshMembers,
        addMember,
        updateMember,
        deleteMember,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export function useHousehold() {
  const context = useContext(HouseholdContext)
  if (!context) throw new Error("useHousehold must be used within a HouseholdProvider")
  return context
}
