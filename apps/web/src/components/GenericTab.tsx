export default function GenericTab({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  )
}
