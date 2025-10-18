// Lấy household info của user hiện tại (dựa vào token)
export async function getHouseholdInfo(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/house-hold`, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Không lấy được thông tin hộ khẩu");
  }
  return await res.json();
}
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" // backend NestJS

export async function postJSON(url: string, data: any) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // gửi cookie refreshToken
    })

    const json = await res.json()
    if (!res.ok) {
      const message = json.message || "Yêu cầu thất bại"
      throw new Error(message)
    }

    return json
  } catch (error: any) {
    console.error(` API POST ${url} error:`, error)
    throw new Error(error.message || "Lỗi kết nối đến máy chủ")
  }
}
// 
export async function createHouseholdAndHead(data: any, token?: string) {
  try {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/house-hold`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) {
      const message = json.message || "Tạo hộ khẩu thất bại";
      throw new Error(message);
    }
    return json;
  } catch (error: any) {
    console.error(`API POST /house-hold error:`, error);
    throw new Error(error.message || "Lỗi kết nối đến máy chủ");
  }
}



