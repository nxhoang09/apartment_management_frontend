import { apiRequest } from "@/lib/api/api";
import { Fee } from "./feesApi";

export interface CreateAssignmentDto {
  feeId: number;
  householdIds: number[];
  dueDate: string;
}
export interface Payment {
  id: number;
  feeAssignmentId: number;
  amountPaid: number;
  imageUrl: string;
  imagePath: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  paidDate: string;
  note?: string;
}

export interface FeeAssignmentItem {
  id: number;
  feeId: number;
  householdId: number;
  amountDue: number;
  dueDate: string;
  isPaid: boolean;
  paidDate: string | null;
  household?: {
    id: number;
    houseHoldCode: number;
    head?: { fullname: string };
  };
  fee?: Fee;
  Payment?: Payment;
}

export const feeAssignmentsApi = {
  createAssignment(data: CreateAssignmentDto, token?: string): Promise<any> {
    return apiRequest("/fee/assign", "POST", data, token);
  },

  getFeeDetail(feeId: number, token?: string): Promise<any> {
    return apiRequest(`/fee/${feeId}/detail`, "GET", undefined, token);
  },

  getHouseholdFees(householdId: number, token?: string): Promise<any> {
    return apiRequest(`/fee/household/${householdId}`, "GET", undefined, token);
  },
  approvePayment(paymentId: number, token?: string): Promise<any> {
    return apiRequest(`/payments/${paymentId}/approve`, "PATCH", undefined, token);
  },

  rejectPayment(paymentId: number, note: string, token?: string): Promise<any> {
    return apiRequest(`/payments/${paymentId}/reject`, "PATCH", { note }, token);
  }
};