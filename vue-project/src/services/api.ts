// Tệp cấu hình các lời gọi API dùng chung, ví dụ với axios hoặc fetch
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
