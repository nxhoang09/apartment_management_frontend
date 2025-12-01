export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" // backend NestJS

export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: any,
  token?: string
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  if (data && method !== "GET") options.body = JSON.stringify(data);

  const res = await fetch(`${API_URL}${url}`, options);
  const json = await res.json();
  if (!res.ok) {
    const message = json.message || "Yêu cầu thất bại";
    throw new Error(message);
  }
  return json;
}

export async function postJSON(url: string, data: any) {
  return apiRequest(url, "POST", data);
}

export async function createHouseholdAndHead(data: any, token?: string) {
  return apiRequest("/house-hold", "POST", data, token);
}

export async function getHouseholdInfo(token?: string) {  
  return apiRequest("/house-hold", "GET", undefined, token);
}

export async function getHouseholdMembers(token?: string) {
  return apiRequest("/house-hold/member", "GET", undefined, token);
}

export async function addHouseholdMember(data: any, token?: string) {
  return apiRequest("/house-hold/addmember", "POST", data, token);
}

export async function updateHouseHoldMember(residentId: number, data: any, token?: string) {
  return apiRequest(`/house-hold/member/${residentId}`, "PATCH", data, token);
}

export async function deleteHouseHoldMember(residentId: number, token?: string) {
  return apiRequest(`/house-hold/member/${residentId}`, "DELETE", undefined, token);
}

export async function updateHouseHoldInfo(data: any, token?: string) {
  return apiRequest("/house-hold/update", "PATCH", data, token);
}


export async function adminGetAllHouseholds(token?: string) { 
  return apiRequest("/admin", "GET", undefined, token); 
}


