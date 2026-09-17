import { Activity } from 'lucide-react';

export function HealthIndicator({ score }: { score: number }) {
  const isHealthy = score > 80;
  const isWarning = score > 50 && score <= 80;
  
  const color = isHealthy ? 'text-green-600 bg-green-100' : isWarning ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100';
  const label = isHealthy ? 'Sehat' : isWarning ? 'Perlu Perhatian' : 'Kritis';

  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${color}`} title={`Skor Kesehatan: ${score}/100`}>
      <Activity className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
