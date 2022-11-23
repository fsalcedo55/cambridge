import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import { TbMessage2 } from "react-icons/tb"
import Modal from "@ui/modal"
import Image from "next/image"
import EditLessonPlan from "./editLessonPlan"

interface Props {
  title: string
  date: any
  handleDeleteModal: () => void
  handleEditModal: () => void
  handleAddCommentModal: () => void
}

export default function LessonPlan({
  title,
  date,
  handleDeleteModal,
  handleEditModal,
  handleAddCommentModal,
}: Props) {
  return (
    <div className="flex flex-col px-4 py-1 border rounded-lg shadow bg-base-100 border-base-300">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="text-xs text-base-300">{date}</div>
        </div>
        <div className="flex text-base-content">
          <div
            onClick={handleAddCommentModal}
            className="flex items-center gap-0.5 hover:bg-base-200 rounded cursor-pointer p-2"
          >
            <div className="text-xl">
              <TbMessage2 />
            </div>
            <div className="text-sm">Comment</div>
          </div>
          <div
            onClick={handleEditModal}
            className="flex items-center gap-0.5 hover:bg-base-200 rounded cursor-pointer p-2"
          >
            <div className="text-xl">
              <RiPencilLine />
            </div>
            <div className="text-sm">Edit</div>
          </div>
          <div
            onClick={handleDeleteModal}
            className="flex items-center gap-0.5 hover:bg-base-200 rounded cursor-pointer p-2"
          >
            <div className="text-xl">
              <RiDeleteBinLine />
            </div>
            <div className="text-sm">Delete</div>
          </div>
        </div>
      </div>
      <div className="h-2"></div>
      {/* Avatar and comment */}
      <div className="flex justify-start w-full gap-4 mb-2">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <Image
              src="https://placeimg.com/192/192/people"
              alt="teacher-photo"
              height={40}
              width={40}
            />
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
