import { AdminNav } from "@/components/shell/AdminNav";
import AppShell from "@/components/shell/AppShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={<AdminNav />}>{children}</AppShell>
  );
}
