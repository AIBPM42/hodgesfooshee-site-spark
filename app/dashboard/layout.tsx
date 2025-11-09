import { SideNav } from "@/components/shell/SideNav";
import AppShell from "@/components/shell/AppShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Re-enable server-side auth check after fixing cookie sync issue
  // The client-side auth in supabaseBrowser.ts is still protecting API routes

  return (
    <AppShell nav={<SideNav />}>{children}</AppShell>
  );
}
