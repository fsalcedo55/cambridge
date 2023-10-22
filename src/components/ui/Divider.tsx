interface Props {
  label?: string
}

export default function Divider({ label }: Props) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      {label && (
        <div className="relative flex justify-center">
          <span className="px-2 text-sm text-gray-500 bg-white">{label}</span>
        </div>
      )}
    </div>
  )
}
