'use client';

import { useState } from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { logout } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user: any;
}

export function Header({ user }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(3);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card z-10 shrink-0">
      <div className="flex items-center flex-1">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Search (Ctrl+K)">
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(user?.full_name || user?.email || 'User')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name || 'Pengguna'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs leading-none text-primary mt-1 capitalize font-medium">
                  {user?.role || 'User'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
