import { UserRole } from './supabase';

/**
 * Check if a role has admin privileges
 * Admin, super_admin, and broker all have the same admin-level access
 */
export function isAdmin(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return ['admin', 'super_admin', 'broker'].includes(role);
}

/**
 * Check if a role is an agent
 */
export function isAgent(role: UserRole | null | undefined): boolean {
  return role === 'agent';
}

/**
 * Check if a role is a public user (buyer/seller)
 */
export function isPublicUser(role: UserRole | null | undefined): boolean {
  return role === 'public_user';
}

/**
 * Check if a role can access the dashboard
 * Admins and agents can access dashboard, public users cannot
 */
export function canAccessDashboard(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return isAdmin(role) || isAgent(role);
}

/**
 * Get a human-readable display name for a role
 */
export function getRoleDisplayName(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
    case 'broker':
      return 'Admin';
    case 'agent':
      return 'Agent';
    case 'public_user':
      return 'User';
    default:
      return 'Unknown';
  }
}
