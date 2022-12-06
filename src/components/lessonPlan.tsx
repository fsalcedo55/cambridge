import { RiPencilLine, RiDeleteBinLine, RiMailSendLine } from "react-icons/ri"
import Image from "next/image"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { TfiMoreAlt } from "react-icons/tfi"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Fragment } from "react"
import dayjs from "dayjs"

interface Props {
  title: string
  date: any
  handleDeleteModal: () => void
  handleEditModal: () => void
  handleDeleteCommentModal: () => void
  comments: any[]
  AddLessonPlanCommentInput: any
  currentUserId: string
  setCommentId: any
  slidesUrl: string | null
  homeworkSent: boolean | null
}

export default function LessonPlan({
  title,
  date,
  handleDeleteModal,
  handleEditModal,
  comments,
  AddLessonPlanCommentInput,
  currentUserId,
  handleDeleteCommentModal,
  setCommentId,
  slidesUrl,
  homeworkSent,
}: Props) {
  return (
    <div className="flex flex-col shadow-lg bg-gradient-to-t from-neutral-50 to-white rounded-xl">
      <div className="flex items-center justify-between px-4 bg-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <h1 className="px-1 py-3 text-3xl font-bold text-primary-800">
            {title}
          </h1>
          <div className="text-xs font-light text-neutral-400">
            {dayjs(date).format("ddd, MMM D, YYYY")}
          </div>
        </div>
        <div className="flex gap-2">
          {slidesUrl && (
            <div className="h-full px-3 py-1 border-2 rounded-full cursor-pointer border-neutral-100 hover:text-accent-700 hover:bg-accent-200 text-neutral-500 hover:border-accent-700">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={slidesUrl}
                className="flex items-center gap-2 text-sm"
              >
                <FaExternalLinkAlt />
                <span>Slides</span>
              </a>
            </div>
          )}

          {homeworkSent && (
            <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-0.5 text-sm font-medium text-accent-800 gap-2">
              <RiMailSendLine />
              Homework Sent
            </span>
          )}
          <div className="flex justify-between h-8">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full px-2 py-1 my-1 text-sm font-medium text-gray-700 border-gray-300 rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 hover:shadow">
                  <TfiMoreAlt />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow-lg w-36 bg-base-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={handleEditModal}
                          className="flex items-center gap-0.5 hover:bg-base-200 text-base-content rounded cursor-pointer p-3"
                        >
                          <div className="text-xl">
                            <RiPencilLine />
                          </div>
                          <div className="text-sm">Edit</div>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={handleDeleteModal}
                          className="flex items-center gap-0.5 hover:bg-base-200 text-base-content rounded cursor-pointer p-3"
                        >
                          <div className="text-xl">
                            <RiDeleteBinLine />
                          </div>
                          <div className="text-sm">Delete</div>
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full px-4 text-sm font-medium text-left shadow rounded-b-xl bg-neutral-100 hover:bg-neutral-200 hover:to-primary-50 focus:outline-none focus-visible:ring focus-visible:ring-primary-focus focus-visible:ring-opacity-75">
              <div className="flex justify-end gap-4 py-2">
                <div className="font-light text-primary-900">
                  {comments.length && comments.length > 1 ? (
                    <div>
                      View all <b className="font-bold">{comments.length}</b>{" "}
                      comments
                    </div>
                  ) : comments.length == 1 ? (
                    <div>
                      View <b className="font-bold">1</b> comment
                    </div>
                  ) : (
                    <div>Leave a comment</div>
                  )}
                </div>
                <div>
                  <AiOutlineCaretDown
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-primary`}
                  />
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-primary-900">
              <div className="flex justify-between">
                {/* Avatar and comment */}
                <div className="w-full px-2 pb-2">
                  {comments &&
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <div>
                          <div className="h-2"></div>
                          <div className="flex justify-start w-full gap-4 mb-2">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <Image
                                  src={comment.User.image}
                                  alt="teacher-photo"
                                  height={40}
                                  width={40}
                                />
                              </div>
                            </div>
                            <Menu
                              as="div"
                              className="relative flex gap-1 group"
                            >
                              <div className="flex flex-col px-3 py-1 text-sm rounded-lg shadow group bg-neutral-100 text-primary-900">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold">
                                    {comment.User.name}
                                  </p>
                                  <div className="text-xs font-thin opacity-50">
                                    {`${dayjs(comment.createdAt).format(
                                      "MMM D, YYYY h:mma"
                                    )}`}
                                  </div>
                                </div>
                                <p>{comment.content}</p>
                              </div>
                              <div>
                                {comment.User.id == currentUserId && (
                                  <Menu.Button className="invisible h-5 px-2 py-1 rounded-lg shadow cursor-pointer hover:bg-neutral-200 bg-neutral-100 group-hover:visible">
                                    <TfiMoreAlt />
                                  </Menu.Button>
                                )}
                              </div>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-6 origin-top-right rounded-md shadow-lg w-36 bg-base-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-2">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <div
                                          onClick={(id) => {
                                            setCommentId(comment.id)
                                            return handleDeleteCommentModal()
                                          }}
                                          className="flex items-center gap-0.5 hover:bg-base-200 text-base-content rounded cursor-pointer p-3"
                                        >
                                          <div className="text-xl">
                                            <RiDeleteBinLine />
                                          </div>
                                          <div className="text-sm">Delete</div>
                                        </div>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* <div>{AddLessonPlanCommentInput}</div> */}
                </div>
              </div>
              <div>{AddLessonPlanCommentInput}</div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
