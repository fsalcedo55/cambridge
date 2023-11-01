import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri"

interface UnitCrudTabsProps {
  editUnit: () => void
  numberOfLessons: number
  deleteUnitDisabled: () => void
  deleteUnit: () => void
}

export function UnitCrudTabs({
  editUnit,
  numberOfLessons,
  deleteUnitDisabled,
  deleteUnit,
}: UnitCrudTabsProps) {
  return (
    <span className="flex justify-end gap-3 pb-3 rounded-md isolate">
      <button
        onClick={editUnit}
        type="button"
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <RiPencilLine
          className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
          aria-hidden="true"
        />
        Edit Unit
      </button>

      {numberOfLessons > 0 ? (
        <button
          onClick={deleteUnitDisabled}
          type="button"
          className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-danger-500 focus:outline-none focus:ring-1 focus:ring-danger-500 hover:cursor-not-allowed"
        >
          <RiDeleteBinLine
            className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
            aria-hidden="true"
          />
          Delete Unit
        </button>
      ) : (
        <button
          onClick={deleteUnit}
          type="button"
          className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <RiDeleteBinLine
            className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
            aria-hidden="true"
          />
          Delete Unit
        </button>
      )}
    </span>
  )
}
