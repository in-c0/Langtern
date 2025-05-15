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
} from "@/lib/auth-service"

type AuthContextType = {
  user: AuthResponse | null
  isLoading: boolean
  signIn: (credentials: LoginCredentials) => Promise<{ error: string | null }>
  signUp: (credentials: RegisterCredentials) => Promise<{ error: string | null; user: AuthResponse | null }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth data from localStorage on initial render
  useEffect(() => {
    const storedAuth = getStoredAuth()
    if (storedAuth) {
      setUser(storedAuth)
    }
    setIsLoading(false)
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    const { data, error } = await loginUser(credentials)

    if (data) {
      setUser(data)
      storeAuth(data)
    }

    setIsLoading(false)
    return { error }
  }

  const signUp = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    const { data, error } = await registerUser(credentials)

    if (data) {
      setUser(data)
      storeAuth(data)
    }

    setIsLoading(false)
    return { error, user: data }
  }

  const signOut = () => {
    setUser(null)
    clearAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
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
