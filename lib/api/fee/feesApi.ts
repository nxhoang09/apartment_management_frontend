import { apiRequest } from "@/lib/api/api";

export interface Fee {
  id: number;
  name: string;
  description?: string;
  type: string;
  frequency: string;
  ratePerPerson: number;
  minium?: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export const feesApi = {
  getFees(token?: string): Promise<Fee[]> {
    return apiRequest("/fee", "GET", undefined, token);
  },

  createFee(data: any, token?: string): Promise<Fee> {
    return apiRequest("/fee", "POST", data, token);
  },

  updateFee(id: number, data: any, token?: string): Promise<Fee> {
    return apiRequest(`/fee/${id}`, "PATCH", data, token);
  },

  deleteFee(id: number, token?: string): Promise<void> {
    return apiRequest(`/fee/${id}`, "DELETE", undefined, token);
  },
};
