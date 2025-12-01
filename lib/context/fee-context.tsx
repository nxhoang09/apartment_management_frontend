"use client"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { feesApi, type Fee } from "@/lib/api/fee/feesApi"
import { feeAssignmentsApi, FeeAssignmentItem, CreateAssignmentDto } from "@/lib/api/fee/feeAssignmentsApi"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

interface FeeContextType {
  fees: Fee[]
  feesLoading: boolean
  loadFees: () => Promise<void>
  createFee: (data: Parameters<typeof feesApi.createFee>[0]) => Promise<void>
  updateFee: (id: number, data: Parameters<typeof feesApi.updateFee>[1]) => Promise<void>
  deleteFee: (id: number) => Promise<void>

  createAssignment: (data: CreateAssignmentDto) => Promise<void>
  
  getFeeDetail: (feeId: number) => Promise<Fee & { assignments: FeeAssignmentItem[] }>
  getHouseholdFees: (householdId: number) => Promise<FeeAssignmentItem[]>

  approvePayment:(paymentId: number) => Promise<void>
  rejectPayment: (paymentId: number, note: string) => Promise<void>
}

const FeeContext = createContext<FeeContextType | undefined>(undefined)

export function FeeProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [fees, setFees] = useState<Fee[]>([])
  const [feesLoading, setFeesLoading] = useState(true)

  const loadFees = useCallback(async () => {
    try {
      setFeesLoading(true)
      const response: any = await feesApi.getFees(token || undefined)
      const data = Array.isArray(response) ? response : (response.data || [])
      setFees(data)
    } catch (error) {
      console.error(error)
    } finally {
      setFeesLoading(false)
    }
  }, [token])

  const createFee = useCallback(async (data: any) => {
      await feesApi.createFee(data, token || undefined)
      await loadFees()
  }, [loadFees, token])

  const updateFee = useCallback(async (id: number, data: any) => {
      await feesApi.updateFee(id, data, token || undefined)
      await loadFees()
  }, [loadFees, token])

  const deleteFee = useCallback(async (id: number) => {
      await feesApi.deleteFee(id, token || undefined)
      await loadFees()
  }, [loadFees, token])

  // --- ASSIGNMENT ---
  const createAssignment = useCallback(async (data: CreateAssignmentDto) => {
    await feeAssignmentsApi.createAssignment(data, token || undefined)
  }, [token])

  const getFeeDetail = useCallback(async (feeId: number) => {
    const res = await feeAssignmentsApi.getFeeDetail(feeId, token || undefined)
    return res.data 
  }, [token])

  const getHouseholdFees = useCallback(async (householdId: number) => {
    const res = await feeAssignmentsApi.getHouseholdFees(householdId, token || undefined)
    return res.data
  }, [token])


  const approvePayment = useCallback(async (paymentId: number) => {
    await feeAssignmentsApi.approvePayment(paymentId, token || undefined)
    toast.success("Đã duyệt thanh toán",{ description: "Thành công"})
  },[token])
  const rejectPayment = useCallback(async (paymentId: number, note: string) => {
    await feeAssignmentsApi.rejectPayment(paymentId, note, token || undefined)
    toast.error("Đã từ chối",{description: "Thanh toán đã bị từ chối",})
  }, [token])

  return (
    <FeeContext.Provider
      value={{
        fees,
        feesLoading,
        loadFees,
        createFee,
        updateFee,
        deleteFee,
        createAssignment,
        getFeeDetail,
        getHouseholdFees,
        approvePayment,
        rejectPayment
      }}
    >
      {children}
    </FeeContext.Provider>
  )
}

export function useFeeContext() {
  const context = useContext(FeeContext)
  if (undefined === context) throw new Error("useFeeContext must be used within FeeProvider")
  return context
}