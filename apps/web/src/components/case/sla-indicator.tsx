'use client';

import { Clock } from 'lucide-react';

export function SLAIndicator({ remainingDays, status }: { remainingDays: number, status: 'GREEN' | 'YELLOW' | 'RED' }) {
  const colors = {
    GREEN: 'bg-green-100 text-green-800 border-green-200',
    YELLOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    RED: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${colors[status]}`}>
      <Clock className="h-4 w-4" />
      <span>SLA: {remainingDays > 0 ? `${remainingDays} Hari Lagi` : 'Terlambat'}</span>
    </div>
  );
}
