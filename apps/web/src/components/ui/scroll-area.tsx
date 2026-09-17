import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          className
        )}
        {...props}
      >
        <div 
          className={cn(
            'h-full w-full rounded-[inherit]',
            orientation === 'vertical' || orientation === 'both' ? 'overflow-y-auto' : 'overflow-y-hidden',
            orientation === 'horizontal' || orientation === 'both' ? 'overflow-x-auto' : 'overflow-x-hidden',
            '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
