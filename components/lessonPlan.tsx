import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import Modal from "../components/modal"
import { useState } from "react"

interface Props {
  title: string
  date: string
  handleDeleteModal: any
  deleteLessonPlan: any
  isOpenDeleteModal: boolean
  setIsOpenDeleteModal: any
  id: string
}

export default function LessonPlan({
  title,
  date,
  handleDeleteModal,
  deleteLessonPlan,
  isOpenDeleteModal,
  setIsOpenDeleteModal,
  id,
}: Props) {
  return (
    <div className="flex flex-col px-4 py-1 rounded-lg shadow bg-gradient-to-b from-[#f9fafb] border border-base-300">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-xs text-base-300">{date}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="text-xl text-base-300 hover:text-primary tooltip tooltip-left"
            data-tip="Edit"
          >
            <RiPencilLine />
          </button>

          <button
            type="button"
            className="text-xl text-base-300 hover:text-error tooltip tooltip-error tooltip-right"
            data-tip="Delete"
            onClick={handleDeleteModal}
          >
            <RiDeleteBinLine />
          </button>
          {/* Delete Modal */}
          <Modal
            isOpen={isOpenDeleteModal}
            setIsOpen={setIsOpenDeleteModal}
            // loading={deleteLoading}
            currentData={id}
            actionFunction={deleteLessonPlan}
            closeButton="Cancel"
            actionButton="Delete"
            actionButtonLoading="Deleting"
            actionButtonStyle="btn btn-error"
            title="Delete Lesson Plan"
            description={
              <div>
                <p className="mt-2">
                  Are you sure you want to delete this lesson plan?
                </p>
              </div>
            }
          />
        </div>
      </div>
      <div className="h-2"></div>
      {/* Avatar and comment */}
      <div className="flex justify-start w-full gap-4 mb-2">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <img src="https://placeimg.com/192/192/people" />
          </div>
        </div>
        <div className="flex flex-col px-3 py-1 text-sm rounded-lg bg-base-200">
          <div className="flex items-center gap-2">
            <p className="font-bold">Elizabeth Tejeda</p>
            <div className="text-xs font-light opacity-60">Timestamp</div>
          </div>
          <p>Description of the class goes here</p>
        </div>
      </div>
    </div>
  )
}
