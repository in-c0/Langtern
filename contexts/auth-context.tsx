"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  loginUser,
  registerUser,
  getStoredAuth,
  storeAuth,
  clearAuth,
  type AuthResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type CompleteProfileData,
} from "@/lib/auth-service"

// Extended AuthResponse to include userType
interface ExtendedAuthResponse extends AuthResponse {
  userType?: "student" | "business"
}

type AuthContextType = {
  user: ExtendedAuthResponse | null
  isLoading: boolean
  signIn: (credentials: LoginCredentials) => Promise<{ error: string | null }>
  signUp: (
    credentials: RegisterCredentials | CompleteProfileData,
  ) => Promise<{ error: string | null; user: ExtendedAuthResponse | null }>
  signOut: () => void
  updateUserType: (type: "student" | "business") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedAuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth data from localStorage on initial render
  useEffect(() => {
    const storedAuth = getStoredAuth()
    if (storedAuth) {
      setUser(storedAuth as ExtendedAuthResponse)
    }
    setIsLoading(false)
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    const { data, error } = await loginUser(credentials)

    if (data) {
      // Cast to ExtendedAuthResponse and set default userType if not present
      const extendedData = data as ExtendedAuthResponse
      if (!extendedData.userType) {
        extendedData.userType = "student" // Default to student
      }
      setUser(extendedData)
      storeAuth(extendedData)
    }

    setIsLoading(false)
    return { error }
  }

  const signUp = async (credentials: RegisterCredentials | CompleteProfileData) => {
    setIsLoading(true)
    const { data, error } = await registerUser(credentials)

    if (data) {
      // Cast to ExtendedAuthResponse and set default userType
      const extendedData = data as ExtendedAuthResponse
      extendedData.userType = "student" // Default new users to student
      setUser(extendedData)
      storeAuth(extendedData)
    }

    setIsLoading(false)
    return { error, user: data as ExtendedAuthResponse | null }
  }

  const signOut = () => {
    setUser(null)
    clearAuth()
  }

  // Add function to update user type
  const updateUserType = (type: "student" | "business") => {
    if (user) {
      const updatedUser = { ...user, userType: type }
      setUser(updatedUser)
      storeAuth(updatedUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
