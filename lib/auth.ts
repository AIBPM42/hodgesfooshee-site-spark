import { supabase, UserRole, Profile } from './supabase'

export async function signUp(email: string, password: string, role: UserRole, metadata: {
  first_name: string
  last_name: string
  phone?: string
}) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('Failed to create user')

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      role,
      status: role === 'agent' ? 'pending' : 'active', // Agents need approval
      first_name: metadata.first_name,
      last_name: metadata.last_name,
      phone: metadata.phone,
    })

  if (profileError) throw profileError

  return authData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return profile
}

export async function checkRole(allowedRoles: UserRole[]): Promise<boolean> {
  const profile = await getCurrentUser()
  if (!profile) return false
  return allowedRoles.includes(profile.role)
}
