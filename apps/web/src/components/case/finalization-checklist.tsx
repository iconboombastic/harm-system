'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FinalizationChecklist() {
  const items = [
    { label: 'Metadata lengkap', status: true },
    { label: 'Dokumen wajib tersedia', status: true },
    { label: 'Review telah diselesaikan', status: false },
    { label: 'Persetujuan selesai', status: false },
  ];

  const completed = items.filter(i => i.status).length;
  const progress = (completed / items.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Checklist Finalisasi ({Math.round(progress)}%)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-2 mt-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center space-x-2 text-sm">
              {item.status ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
