import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Brain, 
  BarChart3, 
  Users, 
  Settings,
  Bell,
  User,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const sidebarModules = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: 'MLS Data Sync',
    href: '/admin/mls',
    icon: Database,
    badge: 'Active'
  },
  {
    title: 'AI & Automation',
    href: '/admin/ai',
    icon: Brain,
    badge: 'Beta'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics', 
    icon: BarChart3
  },
  {
    title: 'Social & Agents',
    href: '/admin/social',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function DashboardLayout() {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const module = sidebarModules.find(m => m.href === path);
    return module ? ['Backend Dashboard', module.title] : ['Backend Dashboard'];
  };

  return (
    <div className="min-h-screen page-wrap">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 h-16 nav-wrap backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="flex h-full items-center justify-between px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-secondary">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb}>
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                <span className={index === getBreadcrumbs().length - 1 ? 'text-primary font-medium' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Professional Sidebar */}
        <aside className="w-64 h-[calc(100vh-4rem)] nav-wrap border-r border-[var(--border-subtle)] p-4">
          <div className="space-y-2">
            {sidebarModules.map((module) => {
              const isActive = module.exact 
                ? location.pathname === module.href
                : location.pathname.startsWith(module.href);
                
              return (
                <Link
                  key={module.href}
                  to={module.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'btn-accent text-[var(--accent-orange)]' 
                      : 'text-secondary hover:text-primary hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]'
                    }
                  `}
                >
                  <module.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{module.title}</span>
                  {module.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto text-xs ${
                        module.badge === 'Active' 
                          ? 'bg-[color-mix(in_srgb,var(--accent-green)_20%,transparent)] text-[var(--accent-green)] border-[var(--accent-green)]'
                          : 'bg-[color-mix(in_srgb,var(--accent-purple)_20%,transparent)] text-[var(--accent-purple)] border-[var(--accent-purple)]'
                      }`}
                    >
                      {module.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          <Separator className="my-6 bg-[var(--border-subtle)]" />
          
          {/* Quick Stats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Quick Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-secondary">
                <span>Active Listings</span>
                <span className="text-[var(--accent-green)] font-medium">2,847</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>API Health</span>
                <span className="text-[var(--accent-green)] font-medium">100%</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Last Sync</span>
                <span className="text-secondary">5m ago</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}