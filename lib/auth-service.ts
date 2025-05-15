const API_BASE_URL = "https://bigbackend-2.vercel.app"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  _id: number
  email: string
  firstName: string
  lastName: string
  token: string
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<{ data: AuthResponse | null; error: string | null }> {
  try {
    console.log("Logging in user:", credentials.email)

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    })

    // Get the raw text response first
    const rawText = await response.text()
    console.log("Raw login response:", rawText)

    if (!response.ok) {
      return {
        data: null,
        error: `Login failed: ${response.status} ${response.statusText}`,
      }
    }

    try {
      const data = JSON.parse(rawText)
      return { data, error: null }
    } catch (error) {
      console.error("Error parsing login response:", error)
      return {
        data: null,
        error: "Invalid response from server",
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<{ data: AuthResponse | null; error: string | null }> {
  try {
    console.log("Registering user:", credentials.email)

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    })

    // Get the raw text response first
    const rawText = await response.text()
    console.log("Raw register response:", rawText)

    if (!response.ok) {
      return {
        data: null,
        error: `Registration failed: ${response.status} ${response.statusText}`,
      }
    }

    try {
      const data = JSON.parse(rawText)
      return { data, error: null }
    } catch (error) {
      console.error("Error parsing register response:", error)
      return {
        data: null,
        error: "Invalid response from server",
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function getStoredAuth(): AuthResponse | null {
  if (typeof window === "undefined") return null

  const authData = localStorage.getItem("auth")
  if (!authData) return null

  try {
    return JSON.parse(authData)
  } catch (error) {
    console.error("Error parsing stored auth data:", error)
    return null
  }
}

export function storeAuth(auth: AuthResponse): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth", JSON.stringify(auth))
}

export function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth")
}
