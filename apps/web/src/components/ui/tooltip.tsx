'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({
  children,
  content,
  className,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-3 py-1.5 text-xs text-primary-foreground bg-primary rounded-md shadow-md -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap animate-in fade-in-0 zoom-in-95",
          className
        )}>
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
        </div>
      )}
    </div>
  );
}
