export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/auth" // backend NestJS

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
