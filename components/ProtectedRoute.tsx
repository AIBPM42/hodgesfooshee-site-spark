"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { UserRole } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Not logged in
      if (!user) {
        router.push(redirectTo)
        return
      }

      // Logged in but wrong role
      if (profile && !allowedRoles.includes(profile.role)) {
        router.push('/unauthorized')
        return
      }

      // Account pending approval
      if (profile && profile.status === 'pending') {
        router.push('/pending-approval')
        return
      }

      // Account suspended
      if (profile && profile.status === 'suspended') {
        router.push('/account-suspended')
        return
      }
    }
  }, [user, profile, loading, allowedRoles, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || !allowedRoles.includes(profile.role) || profile.status !== 'active') {
    return null
  }

  return <>{children}</>
}
