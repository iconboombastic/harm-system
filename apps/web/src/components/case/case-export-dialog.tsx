'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function CaseExportDialog({ caseId }: { caseId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"/> Export Case</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data Case</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Metadata & Timeline</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Dokumen Utama</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Evidence & Lampiran</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Log Audit</span></Label>
          </div>
          <Button className="w-full">Mulai Unduhan (ZIP)</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
