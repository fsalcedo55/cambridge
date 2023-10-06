import { Disclosure } from "@headlessui/react"
import AddLevel from "@src/components/admin/lessons/AddLevel"
import AddUnit from "@src/components/admin/lessons/AddUnit"
import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import Modal from "@src/components/ui/modal"
import PageHeading from "@src/components/ui/pageHeading"
import { trpc } from "@src/utils/trpc"
import { useState } from "react"
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiPencilRulerLine,
  RiSlideshowLine,
} from "react-icons/ri"
import { SiBookstack } from "react-icons/si"
import Image from "next/image"
import { BsCheckLg } from "react-icons/bs"
import { MdDescription, MdError, MdUnpublished } from "react-icons/md"
import AddLesson from "@src/components/admin/lessons/AddLesson"
import Link from "next/link"
import EditLevel from "@src/components/admin/lessons/EditLevel"
import EditUnit from "@src/components/admin/lessons/EditUnit"
import Loading from "@src/components/ui/loading"
import {
  CurrentLesson,
  LevelPanel,
  UnitPanel,
} from "@src/components/curriculum/curriculumDisclosure"

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

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ")
  }

  if (levels.isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  interface UnitCrudTabsProps {
    editUnit: () => void
    numberOfLessons: number
    deleteUnitDisabled: () => void
    deleteUnit: () => void
  }

  function UnitCrudTabs({
    editUnit,
    numberOfLessons,
    deleteUnitDisabled,
    deleteUnit,
  }: UnitCrudTabsProps) {
    const deleteUnitIcon = (
      <RiDeleteBinLine
        className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
        aria-hidden="true"
      />
    )

    const editUnitIcon = (
      <RiPencilLine
        className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
        aria-hidden="true"
      />
    )

    const tabButton = (
      handleOnClick: any,
      icon: any,
      title: string,
      editButton: boolean
    ) => {
      const tabButtonStyles = () => {
        if (numberOfLessons > 0) {
          if (!editButton) {
            return "relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-danger-500 focus:outline-none focus:ring-1 focus:ring-danger-500 hover:cursor-not-allowed"
          } else {
            return "relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          }
        } else
          return "relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      }
      return (
        <button
          onClick={handleOnClick}
          type="button"
          className={tabButtonStyles()}
        >
          {icon}
          {title}
        </button>
      )
    }
    return (
      <span className="flex justify-end gap-3 pb-3 rounded-md isolate">
        {tabButton(editUnit, editUnitIcon, "Edit Unit", true)}
        {numberOfLessons > 0 ? (
          <div>
            {tabButton(
              deleteUnitDisabled,
              deleteUnitIcon,
              "Delete Unit",
              false
            )}
          </div>
        ) : (
          <div>
            {tabButton(deleteUnit, deleteUnitIcon, "Delete Unit", false)}
          </div>
        )}
      </span>
    )
  }

  function curriculumDisclosure(levelsArray: any, admin: boolean) {
    return (
      <nav className="h-full mt-3 overflow-y-auto" aria-label="Directory">
        {levelsArray &&
          levelsArray.map((level: any) => (
            <div key={level.id} className="relative">
              {
                <LevelPanel
                  levelNumber={level.number}
                  levelTitle={level.title}
                  levelPublished={level.published}
                  levelObj={undefined}
                  numberOfUnits={level.Unit.length}
                  levelId={level.id}
                  editLevelModal={() => handleEditLevelModal(level)}
                  setStateOpenDisabledDeleteLevelModal={() =>
                    setIsOpenDisabledDeleteLevelModal(true)
                  }
                  deleteLevelModal={() => handleDeleteLevelModal(level.id)}
                  admin={admin}
                />
              }
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
                        {
                          <UnitPanel
                            imageUrl={currentUnit.photoUrl}
                            title={currentUnit.title}
                            levelPublished={level.published}
                            unitPublished={currentUnit.published}
                            unitNumber={currentUnit.number}
                            numberOfLessons={currentUnit.Lesson.length}
                            admin={admin}
                          />
                        }
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-6 pb-3 shadow-inner bg-gradient-to-l from-neutral-400 to-neutral-200 text-neutral-500">
                        {admin && (
                          <UnitCrudTabs
                            editUnit={() => handleEditUnitModal(currentUnit)}
                            numberOfLessons={currentUnit.Lesson.length}
                            deleteUnitDisabled={() =>
                              setIsOpenDisabledDeleteUnitModal(true)
                            }
                            deleteUnit={() =>
                              handleDeleteUnitModal(currentUnit.id)
                            }
                          />
                        )}
                        {!admin && <div className="h-4"></div>}
                        <CurrentLesson
                          lessonList={currentUnit?.Lesson}
                          admin={admin}
                          unitPublished={currentUnit.published}
                        />
                      </Disclosure.Panel>
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </nav>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageHeading pageTitle="Curriculum" />
        <div className="flex justify-start gap-3 my-3">
          {addLevelBtn} {addUnitBtn} {addLessonBtn}
        </div>
      </div>
      <div className="z-50">{curriculumDisclosure(levels.data, true)}</div>
      {/* <CurriculumNav
        levelsArray={levels.data}
        handleEditLevelModal={handleEditLevelModal}
      /> */}
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
