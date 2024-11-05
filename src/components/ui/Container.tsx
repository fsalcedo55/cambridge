interface ContainerProps {
  title: string
  children: React.ReactNode
}

export default function Container({ title, children }: ContainerProps) {
  return (
    <div className="px-4 pb-2 bg-white shadow rounded-xl">
      <div className="py-2 text-xl font-bold">{title}</div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-b border-gray-300" />
        </div>
        <div className="relative flex justify-center"></div>
      </div>
      <div className="py-3">{children}</div>
    </div>
  )
}
