'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === '/command-center' || pathname === '/') {
    return (
      <div className="flex items-center text-sm font-medium text-foreground">
        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
        Command Center
      </div>
    );
  }

  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center space-x-1 sm:space-x-2 text-sm text-muted-foreground">
        <li>
          <Link href="/command-center" className="hover:text-foreground transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          // Format text (capitalize and replace hyphens)
          const text = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {text}
                </span>
              ) : (
                <Link href={href} className="hover:text-foreground transition-colors">
                  {text}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
