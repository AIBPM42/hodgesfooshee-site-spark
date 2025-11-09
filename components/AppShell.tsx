"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🔥" },
  { href: "/market", label: "Market Analytics", icon: "📊" },
  { href: "/neighborhood", label: "Neighborhood Intel", icon: "🏙️" },
  { href: "/deals", label: "Deals & Offers", icon: "💼" },
  { href: "/agents", label: "Agents & Pipeline", icon: "👥" },
  { href: "/reports", label: "Reports", icon: "📈" },
  { href: "/forms", label: "Forms (Multi-Lang)", icon: "🧾" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

interface AgentProfile {
  mls_member_key: string | null;
  photo_url: string | null;
  office_name: string | null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgentProfile() {
      if (!user || !profile || profile.role !== 'agent') {
        setLoading(false);
        return;
      }

      try {
        // Get agent profile from database
        const { data: agentData } = await supabase
          .from('agent_profiles')
          .select('mls_member_key, photo_url, office_name')
          .eq('user_id', user.id)
          .single();

        if (agentData) {
          setAgentProfile(agentData);
        }
      } catch (error) {
        console.error('Error loading agent profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgentProfile();
  }, [user, profile]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0D14] text-black dark:text-white">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#E87722] via-[#6F4DA0] to-[#7BB241]" />
            <div className="text-xl font-semibold">Hodges Pro</div>
            <div className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
              Nashville & Middle TN
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-6">
        <aside className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0F1420] h-fit sticky top-24">
          {/* Agent Profile Section */}
          {profile && profile.role === 'agent' && agentProfile && !loading && (
            <div className="p-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={agentProfile.photo_url || 'https://ui-avatars.com/api/?name=' + (profile.first_name || 'A')}
                  alt={profile.first_name + ' ' + profile.last_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E87722]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="text-xs text-black/60 dark:text-white/60 truncate">
                    {agentProfile.office_name || 'Agent'}
                  </div>
                  {agentProfile.mls_member_key && (
                    <div className="text-xs text-[#E87722] font-mono">
                      MLS: {agentProfile.mls_member_key}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <nav className="py-3">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl mx-2 transition-colors",
                    active
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                      : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
