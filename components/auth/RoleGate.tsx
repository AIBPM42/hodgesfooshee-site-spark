"use client";

import { UserRole } from '@/lib/supabase';
import { isAdmin, isAgent } from '@/lib/roleHelpers';

export default function RoleGate({
  role,
  allow,
  children
}:{
  role?: UserRole;
  allow: 'admin' | 'agent' | 'public';
  children: React.ReactNode;
}) {
  if (!role) return null;

  // Check access based on allowed role
  switch (allow) {
    case 'admin':
      // Only admins (admin, super_admin, broker) can see
      return isAdmin(role) ? <>{children}</> : null;

    case 'agent':
      // Admins and agents can see, public users cannot
      return (isAdmin(role) || isAgent(role)) ? <>{children}</> : null;

    case 'public':
      // Everyone can see
      return <>{children}</>;

    default:
      return null;
  }
}
