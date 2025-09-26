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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Glass Header */}
      <header className="sticky top-0 z-50 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex h-full items-center justify-between px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb}>
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                <span className={index === getBreadcrumbs().length - 1 ? 'text-neutral-100 font-medium' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-neutral-100">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-neutral-100">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-4rem)] bg-white/5 backdrop-blur-xl border-r border-white/10 p-4">
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
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30' 
                      : 'text-neutral-300 hover:text-neutral-100 hover:bg-white/5'
                    }
                  `}
                >
                  <module.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{module.title}</span>
                  {module.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto text-xs bg-green-500/20 text-green-300 border-green-500/30"
                    >
                      {module.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          <Separator className="my-6 bg-white/10" />
          
          {/* Quick Stats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Quick Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>Active Listings</span>
                <span className="text-green-400 font-medium">2,847</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>API Health</span>
                <span className="text-green-400 font-medium">100%</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Last Sync</span>
                <span className="text-neutral-400">5m ago</span>
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