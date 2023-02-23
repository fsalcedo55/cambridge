import { Disclosure } from "@headlessui/react"
import AddLevel from "@src/components/admin/lessons/AddLevel"
import AddUnit from "@src/components/admin/lessons/AddUnit"
import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import Modal from "@src/components/ui/modal"
import PageHeading from "@src/components/ui/pageHeading"
import { trpc } from "@src/utils/trpc"
import { useState } from "react"
import { RiDeleteBinLine, RiPencilLine, RiSlideshowLine } from "react-icons/ri"
import { SiBookstack } from "react-icons/si"
import Image from "next/image"
import { BsCheckLg } from "react-icons/bs"
import { MdError, MdUnpublished } from "react-icons/md"
import AddLessonPlan from "@src/components/addLessonPlan"
import AddLesson from "@src/components/admin/lessons/AddLesson"
import Link from "next/link"
import EditLevel from "@src/components/admin/lessons/EditLevel"
import EditUnit from "@src/components/admin/lessons/EditUnit"
import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

export default function Curriculum() {
  const [isOpenLevelBtn, setIsOpenLevelBtn] = useState(false)
  const [isOpenEditLevelModal, setIsOpenEditLevelModal] = useState(false)
  const [isOpenEditUnitModal, setIsOpenEditUnitModal] = useState(false)
  const [isOpenUnitBtn, setIsOpenUnitBtn] = useState(false)
  const [isOpenLessonBtn, setIsOpenLessonBtn] = useState(false)
  const [isOpenDeleteLevelModal, setIsOpenDeleteLevelModal] = useState(false)
  const [isOpenDeleteUnitModal, setIsOpenDeleteUnitModal] = useState(false)
  const [isOpenDisabledDeleteUnitModal, setIsOpenDisabledDeleteUnitModal] =
    useState(false)
  const [isOpenDisabledDeleteLevelModal, setIsOpenDisabledDeleteLevelModal] =
    useState(false)
  const [levelId, setLevelId] = useState<string>()
  const [currentLevel, setCurrentLevel] = useState()
  const [currentUnit, setCurrentUnit] = useState()
  const [unitId, setUnitId] = useState<string>()
  const levels = trpc.level.getAll.useQuery()
  const deleteLevel = trpc.level.delete.useMutation()
  const deleteUnit = trpc.unit.deleteById.useMutation()

  const handleDeleteLevelModal = async (levelId: string) => {
    setIsOpenDeleteLevelModal(true)
    setLevelId(levelId)
  }

  const deleteLevelEvent = async () => {
    try {
      await deleteLevel.mutateAsync({
        id: levelId!,
      })
    } catch (error) {
      console.log("Error deleting level.", error)
    }
    setIsOpenDeleteLevelModal(false)
    setLevelId("")
  }

  const handleDeleteUnitModal = async (unitId: string) => {
    setIsOpenDeleteUnitModal(true)
    setUnitId(unitId)
  }

  const deleteUnitEvent = async () => {
    try {
      await deleteUnit.mutateAsync({
        id: unitId!,
      })
    } catch (error) {
      console.log("Error deleting unit.", error)
    }
    setIsOpenDeleteUnitModal(false)
    setUnitId("")
  }

  const handleEditLevelModal = (level: any) => {
    setIsOpenEditLevelModal(true)
    setCurrentLevel(level)
  }

  const handleEditUnitModal = (unit: any) => {
    setIsOpenEditUnitModal(true)
    setCurrentUnit(unit)
  }

  const addLevelBtn = (
    <div>
      <Button
        intent="primary"
        size="small"
        onClick={() => setIsOpenLevelBtn(true)}
      >
        + Add Level
      </Button>
      <Modal
        isOpen={isOpenLevelBtn}
        setIsOpen={setIsOpenLevelBtn}
        closeButton="Cancel"
        title="Add Level"
        description={<AddLevel closeModal={() => setIsOpenLevelBtn(false)} />}
      />
    </div>
  )

  const addUnitBtn = (
    <div>
      <Button
        intent="primary"
        size="small"
        onClick={() => setIsOpenUnitBtn(true)}
      >
        + Add Unit
      </Button>
      <Modal
        isOpen={isOpenUnitBtn}
        setIsOpen={setIsOpenUnitBtn}
        closeButton="Cancel"
        title="Add Unit"
        description={
          <AddUnit
            closeModal={() => setIsOpenUnitBtn(false)}
            levelsArray={levels.data}
          />
        }
      />
    </div>
  )

  const addLessonBtn = (
    <div>
      <Button
        intent="primary"
        size="small"
        onClick={() => setIsOpenLessonBtn(true)}
      >
        + Add Lesson
      </Button>
      <Modal
        isOpen={isOpenLessonBtn}
        setIsOpen={setIsOpenLessonBtn}
        closeButton="Cancel"
        title="Add Lesson"
        description={
          <AddLesson
            closeModal={() => setIsOpenLessonBtn(false)}
            levelsArray={levels.data}
          />
        }
      />
    </div>
  )

  const timeline = [
    {
      id: 1,
      content: "Applied to",
      target: "Front End Developer",
      href: "#",
      date: "Sep 20",
      datetime: "2020-09-20",
      icon: UserIcon,
      iconBackground: "bg-gray-400",
    },
    {
      id: 2,
      content: "Advanced to phone screening by",
      target: "Bethany Blake",
      href: "#",
      date: "Sep 22",
      datetime: "2020-09-22",
      icon: HandThumbUpIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 3,
      content: "Completed phone screening with",
      target: "Martha Gardner",
      href: "#",
      date: "Sep 28",
      datetime: "2020-09-28",
      icon: CheckIcon,
      iconBackground: "bg-green-500",
    },
    {
      id: 4,
      content: "Advanced to interview by",
      target: "Bethany Blake",
      href: "#",
      date: "Sep 30",
      datetime: "2020-09-30",
      icon: HandThumbUpIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 5,
      content: "Completed interview with",
      target: "Katherine Snyder",
      href: "#",
      date: "Oct 4",
      datetime: "2020-10-04",
      icon: CheckIcon,
      iconBackground: "bg-green-500",
    },
  ]

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageHeading pageTitle="Curriculum" />
        <div className="flex justify-start gap-3 my-3">
          {addLevelBtn} {addUnitBtn} {addLessonBtn}
        </div>
      </div>
      <div className="z-50">
        <nav className="h-full mt-3 overflow-y-auto" aria-label="Directory">
          {levels &&
            levels?.data?.map((level) => (
              <div key={level.id} className="relative">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
                  <div className="flex gap-2">
                    <h3 className="text-xl font-bold text-primary-800">
                      {level.number}. {level.title}
                    </h3>
                    {level.published ? (
                      <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 border border-accent-900 gap-2">
                        <BsCheckLg />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-900 gap-1">
                        <MdUnpublished />
                        Draft
                      </span>
                    )}
                  </div>
                  <span className="inline-flex rounded-md shadow-sm isolate">
                    <button
                      onClick={() => handleEditLevelModal(level)}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-l-full text-neutral-700 border-neutral-300 hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <RiPencilLine
                        className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                    {level.Unit.length > 0 ? (
                      <button
                        onClick={() => setIsOpenDisabledDeleteLevelModal(true)}
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
                        onClick={() => handleDeleteLevelModal(level.id)}
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
                  </span>
                </div>
                <ul
                  role="list"
                  className="relative z-0 divide-y divide-neutral-200"
                >
                  {level.Unit.map((currentUnit: any) => (
                    <li
                      key={currentUnit.id}
                      className="bg-white hover:bg-neutral-50"
                    >
                      <Disclosure>
                        <Disclosure.Button
                          as="div"
                          className="flex items-center justify-between pr-6 cursor-pointer"
                        >
                          <div className="relative flex items-center px-6 py-2 space-x-3 ">
                            <div className="flex-shrink-0">
                              <Image
                                height={120}
                                width={175}
                                src={currentUnit.photoUrl}
                                alt=""
                                className="rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                onClick={() => console.log(currentUnit.id)}
                                className="flex gap-2"
                              >
                                <p className="text-2xl font-bold md:text-2xl text-primary-800">
                                  {currentUnit.title}
                                </p>
                                {level.published == false ? (
                                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-900 gap-1">
                                    <MdUnpublished />
                                    Drafted by the Level
                                  </span>
                                ) : currentUnit.published ? (
                                  <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 border border-accent-900 gap-2">
                                    <BsCheckLg />
                                    Published
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-900 gap-1">
                                    <MdUnpublished />
                                    Draft
                                  </span>
                                )}
                              </div>
                              <p className="font-bold truncate text-neutral-500">
                                Unit {currentUnit.number}
                              </p>
                              <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
                                <SiBookstack />
                                <span>{currentUnit.Lesson.length} Lessons</span>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-6 pb-3 shadow-inner bg-gradient-to-l from-neutral-200 to-neutral-100 text-neutral-500">
                          <span className="flex justify-end gap-3 pb-3 rounded-md isolate">
                            <button
                              onClick={() => handleEditUnitModal(currentUnit)}
                              type="button"
                              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <RiPencilLine
                                className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
                                aria-hidden="true"
                              />
                              Edit Unit
                            </button>

                            {currentUnit.Lesson.length > 0 ? (
                              <button
                                onClick={() =>
                                  setIsOpenDisabledDeleteUnitModal(true)
                                }
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
                                onClick={() =>
                                  handleDeleteUnitModal(currentUnit.id)
                                }
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

                          <div className="flex flex-col gap-3">
                            <div className="flow-root">
                              <ul role="list" className="-mb-8">
                                {currentUnit?.Lesson?.map(
                                  (lesson: any, lessonIdx: number) => (
                                    <li key={lesson.id}>
                                      <div className="relative pb-8">
                                        {lessonIdx !==
                                        currentUnit?.Lesson?.length - 1 ? (
                                          <span
                                            className="absolute top-12 left-6 -ml-px h-24 w-0.5 bg-primary-600"
                                            aria-hidden="true"
                                          />
                                        ) : null}
                                        <div className="relative flex items-center space-x-3">
                                          <div>
                                            <span className="inline-flex items-center justify-center w-12 h-12 p-2 text-2xl font-bold rounded-full bg-primary-800 text-primary-100">
                                              {lesson.number}
                                            </span>
                                          </div>
                                          <Link
                                            href={`/admin/curriculum/${lesson.id}`}
                                          >
                                            <div className="flex justify-between flex-1 min-w-0 space-x-4">
                                              <div className="flex items-center min-w-full space-x-3 bg-white border-2 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-primary-500 hover:shadow hover:cursor-pointer">
                                                <Image
                                                  height={80}
                                                  width={125}
                                                  className="rounded-l"
                                                  src={lesson.photoUrl}
                                                  alt=""
                                                />
                                                <div className="flex items-center justify-between w-full pr-6">
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-bold text-neutral-900">
                                                      {lesson.title}
                                                    </p>
                                                  </div>
                                                  {lesson.slidesUrl ? (
                                                    <div className="text-4xl opacity-80">
                                                      <RiSlideshowLine />
                                                    </div>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>
      </div>
      {/* Delete Level Modal */}
      <Modal
        isOpen={isOpenDeleteLevelModal}
        setIsOpen={setIsOpenDeleteLevelModal}
        actionFunction={deleteLevelEvent}
        loading={deleteLevel.isLoading}
        btnIntent="danger"
        actionButton="Delete"
        loadingLabel="Deleting Level..."
        title="Delete Level"
        description={
          <div>
            <p className="mt-2">Are you sure you want to delete this level?</p>
          </div>
        }
        closeButton="Cancel"
      />
      {/* Disabled Delete Level Modal */}
      <Modal
        isOpen={isOpenDisabledDeleteLevelModal}
        setIsOpen={setIsOpenDisabledDeleteLevelModal}
        title={
          <div className="flex items-center gap-2">
            <span className="text-danger-500">
              <MdError />
            </span>
            Cannot Delete Level
          </div>
        }
        description={
          <div>
            <p className="mt-2">
              You must delete all units or move them to another level before you
              can delete this level.
            </p>
          </div>
        }
        closeButton="Okay"
      />
      {/* Edit Level Modal */}
      <Modal
        isOpen={isOpenEditLevelModal}
        setIsOpen={setIsOpenEditLevelModal}
        actionFunction={deleteLevelEvent}
        title="Edit Level"
        description={
          <EditLevel
            currentLevel={currentLevel}
            closeModal={() => setIsOpenEditLevelModal(false)}
          />
        }
        closeButton="Cancel"
      />
      {/* Edit Unit Modal */}
      <Modal
        isOpen={isOpenEditUnitModal}
        setIsOpen={setIsOpenEditUnitModal}
        actionFunction={deleteLevelEvent}
        title="Edit Unit"
        description={
          <EditUnit
            levels={levels?.data}
            currentUnit={currentUnit}
            closeModal={() => setIsOpenEditUnitModal(false)}
          />
        }
        closeButton="Cancel"
      />
      {/* Delete Unit Modal */}
      <Modal
        isOpen={isOpenDeleteUnitModal}
        setIsOpen={setIsOpenDeleteUnitModal}
        actionFunction={deleteUnitEvent}
        loading={deleteUnit.isLoading}
        btnIntent="danger"
        actionButton="Delete"
        loadingLabel="Deleting Unit..."
        title="Delete Unit"
        description={
          <div>
            <p className="mt-2">Are you sure you want to delete this unit?</p>
          </div>
        }
        closeButton="Cancel"
      />
      {/* Disabled Delete Unit Modal */}
      <Modal
        isOpen={isOpenDisabledDeleteUnitModal}
        setIsOpen={setIsOpenDisabledDeleteUnitModal}
        title={
          <div className="flex items-center gap-2">
            <span className="text-danger-500">
              <MdError />
            </span>
            Cannot Delete Unit
          </div>
        }
        description={
          <div>
            <p className="mt-2">
              You must delete all lessons or move them to another unit before
              you can delete this unit.
            </p>
          </div>
        }
        closeButton="Okay"
      />
    </Layout>
  )
}
