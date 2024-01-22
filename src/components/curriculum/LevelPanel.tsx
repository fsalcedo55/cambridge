import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri"
import { PublishedStatus } from "../ui/badges"

interface LevelPanelProps {
  levelNumber: number
  levelTitle: string
  levelPublished: boolean
  levelObj: any
  numberOfUnits: number
  levelId: string
  editLevelModal?: () => void
  setStateOpenDisabledDeleteLevelModal?: () => void
  deleteLevelModal?: () => void
  admin: boolean
  edit?: boolean
}

export function LevelPanel({
  levelNumber,
  levelTitle,
  levelPublished,
  numberOfUnits,
  editLevelModal,
  setStateOpenDisabledDeleteLevelModal,
  deleteLevelModal,
  admin,
  edit,
  levelId,
}: LevelPanelProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-1 text-sm font-medium rounded-full text-neutral bg-primary-50">
      <div className="flex gap-2">
        <a
          className="text-xl font-bold text-primary-800"
          href={`#level-${levelNumber}-${levelId}`}
        >
          Level {levelNumber}: {levelTitle}
        </a>

        {admin && edit && (
          <div>
            <PublishedStatus published={levelPublished} />
          </div>
        )}
      </div>
      {admin && edit && (
        <span className="inline-flex rounded-md shadow-sm isolate">
          <button
            onClick={editLevelModal}
            type="button"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-l-full text-neutral-700 border-neutral-300 hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <RiPencilLine
              className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
              aria-hidden="true"
            />
            Edit
          </button>
          {admin && edit && (
            <div>
              {numberOfUnits > 0 ? (
                <button
                  onClick={setStateOpenDisabledDeleteLevelModal}
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white border rounded-r-full hover:cursor-not-allowed text-neutral-700 border-neutral-300 focus:z-10 focus:border-danger-500 focus:outline-none focus:ring-1 focus:ring-danger-500"
                >
                  <RiDeleteBinLine
                    className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              ) : (
                <button
                  onClick={deleteLevelModal}
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white border rounded-r-full text-neutral-700 border-neutral-300 hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <RiDeleteBinLine
                    className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              )}
            </div>
          )}
        </span>
      )}
    </div>
  )
}
