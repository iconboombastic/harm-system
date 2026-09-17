'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Inbox, 
  Shield, 
  Users, 
  BarChart3, 
  Search, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = userRole === 'ADMIN' || userRole === 'ATASAN';

  const navItems = [
    { name: 'Command Center', href: '/command-center', icon: LayoutDashboard },
    { name: 'Pekerjaan Saya', href: '/tasks', icon: Briefcase },
    { name: 'Permohonan', href: '/cases', icon: FileText },
    { name: 'Intake', href: '/intake', icon: Inbox },
    { name: 'Evidence', href: '/evidence', icon: Shield },
    { name: 'Meetings', href: '/meetings', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Search', href: '/search', icon: Search },
  ];

  const adminItems = [
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="rounded-full shadow-lg" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2 font-bold text-lg text-primary truncate">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-sm">H</div>
              <span>HARM System</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-sm mx-auto font-bold">H</div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex h-8 w-8 ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className={cn("mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider", collapsed && "text-center px-0")}>
                  {collapsed ? "..." : "Administrasi"}
                </div>
                {adminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>
        
        <div className={cn("p-4 border-t border-border text-xs text-muted-foreground", collapsed && "text-center px-2")}>
          {!collapsed ? "Pemkab Aceh Tamiang" : "AT"}
        </div>
      </aside>
    </>
  );
}
