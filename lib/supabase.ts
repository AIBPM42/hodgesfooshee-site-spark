import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
// Note: 'super_admin' and 'broker' are kept for backward compatibility but map to 'admin'
export type UserRole = 'admin' | 'super_admin' | 'broker' | 'agent' | 'public_user'
export type UserStatus = 'pending' | 'active' | 'suspended' | 'inactive'

export interface Profile {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
