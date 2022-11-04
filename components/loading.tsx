import { CgSpinner } from "react-icons/cg"

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <span className="text-4xl text-primary">
        <CgSpinner className="animate-spin" />
      </span>
    </div>
  )
}
