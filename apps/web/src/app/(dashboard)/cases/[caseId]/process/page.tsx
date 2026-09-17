export default function ProcessTab() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Alur Proses (Workflow)</h2>
      
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
        {['Penerimaan', 'Pemeriksaan Formil', 'Analisis Substansi', 'Rapat Pembahasan', 'Penyelesaian'].map((stage, idx) => (
          <div key={stage} className="relative pl-8">
            <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 ${idx === 0 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
            <h3 className={`font-semibold ${idx === 0 ? 'text-blue-600' : 'text-gray-700'}`}>{stage}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {idx === 0 ? 'Tahap sedang berjalan. Menunggu konfirmasi kelengkapan berkas.' : 'Menunggu tahap sebelumnya selesai.'}
            </p>
            {idx === 0 && (
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Selesaikan Tahap
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
