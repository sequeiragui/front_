"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "seller" | "buyer" | "distributor" | "warehouse" | "delivery" | null

interface SupplyChainContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isEnrolled: boolean
  setIsEnrolled: (enrolled: boolean) => void
}

const SupplyChainContext = createContext<SupplyChainContextType | undefined>(undefined)

export function SupplyChainProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Load saved role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole
    const savedEnrollment = localStorage.getItem("isEnrolled") === "true"

    if (savedRole) {
      setUserRole(savedRole)
    }

    if (savedEnrollment) {
      setIsEnrolled(savedEnrollment)
    }
  }, [])

  // Save role to localStorage when it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole)
    } else {
      localStorage.removeItem("userRole")
    }
  }, [userRole])

  // Save enrollment status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("isEnrolled", isEnrolled.toString())
  }, [isEnrolled])

  return (
    <SupplyChainContext.Provider
      value={{
        userRole,
        setUserRole,
        isEnrolled,
        setIsEnrolled,
      }}
    >
      {children}
    </SupplyChainContext.Provider>
  )
}

export function useSupplyChain() {
  const context = useContext(SupplyChainContext)
  if (context === undefined) {
    throw new Error("useSupplyChain must be used within a SupplyChainProvider")
  }
  return context
}
