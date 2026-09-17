'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0 border-0">
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input 
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            placeholder="Ketik untuk mencari..."
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Belum ada hasil untuk pencarian ini.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
