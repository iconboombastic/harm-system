import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CompletenessScore({ metadata, docs, evidence }: { metadata: number, docs: number, evidence: number }) {
  const overall = Math.round((metadata + docs + evidence) / 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Skor Kelengkapan: {overall}%</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between mb-1"><span>Metadata</span><span>{metadata}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${metadata}%`}}></div></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Dokumen</span><span>{docs}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${docs}%`}}></div></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Evidence</span><span>{evidence}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${evidence}%`}}></div></div>
        </div>
      </CardContent>
    </Card>
  );
}
