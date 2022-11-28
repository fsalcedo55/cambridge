import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import Image from "next/image"
import { forwardRef, FC } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { TfiMoreAlt } from "react-icons/tfi"
import clsx from "clsx"
import { Fragment } from "react"

interface Props {
  title: string
  date: any
  handleDeleteModal: () => void
  handleEditModal: () => void
  handleAddCommentModal: () => void
  comments: any[]
  AddLessonPlanCommentInput: any
}

export default function LessonPlan({
  title,
  date,
  handleDeleteModal,
  handleEditModal,
  comments,
  AddLessonPlanCommentInput,
}: Props) {
  return (
    <div className="flex flex-col shadow rounded-3xl">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left rounded-3xl text-primary bg-gradient-to-l from-neutral-200 to-neutral-100 hover:from-neutral-400 hover:to-neutral-300 focus:outline-none focus-visible:ring focus-visible:ring-primary-focus focus-visible:ring-opacity-75">
              <div className="flex items-center gap-2 ">
                <label className="text-2xl swap swap-flip">
                  {/* <!-- this hidden checkbox controls the state --> */}
                  <input type="checkbox" />

                  <div className="swap-on">✅</div>
                  <div className="swap-off opacity-10">🔲</div>
                </label>
                <h1 className="text-xl font-bold">{title}</h1>
                <div className="text-xs text-primary/50">{date}</div>
              </div>
              <div className="flex gap-4">
                {comments.length && comments.length > 1 ? (
                  <div>View all {comments.length} comments</div>
                ) : comments.length == 1 ? (
                  <div>View 1 comment</div>
                ) : (
                  <div></div>
                )}

                <AiOutlineCaretDown
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-primary`}
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-base-content">
              <div className="flex justify-between">
                {/* Avatar and comment */}
                <div className="w-full px-2 pb-2">
                  {comments &&
                    comments.map((comment) => (
                      <div key={comment.id}>
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
                            <div className="flex flex-col px-3 py-1 text-sm rounded-lg shadow bg-neutral-100">
                              <div className="flex items-center gap-2">
                                <p className="font-bold">{comment.User.name}</p>
                                <div className="text-xs font-light opacity-60">
                                  Timestamp
                                </div>
                              </div>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* <div>{AddLessonPlanCommentInput}</div> */}
                </div>

                <div className="flex justify-between h-8">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full px-2 py-1 my-1 text-sm font-medium text-gray-700 border-gray-300 rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
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
              <div>{AddLessonPlanCommentInput}</div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
