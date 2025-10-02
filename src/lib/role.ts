// Role management utilities (no auth yet, localStorage-based)
export type UserRole = 'public' | 'agent' | 'owner';

const ROLE_KEY = 'hf_user_role';

export function getRole(): UserRole {
  if (typeof window === 'undefined') return 'public';
  return (localStorage.getItem(ROLE_KEY) as UserRole) || 'public';
}

export function setRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROLE_KEY, role);
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('roleChanged', { detail: role }));
}

export function isOwner(): boolean {
  return getRole() === 'owner';
}

export function isAgent(): boolean {
  return getRole() === 'agent';
}
