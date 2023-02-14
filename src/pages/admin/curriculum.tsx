import { Disclosure, Menu, Transition } from "@headlessui/react"
import AddLevel from "@src/components/admin/lessons/AddLevel"
import AddUnit from "@src/components/admin/lessons/AddUnit"
import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import Modal from "@src/components/ui/modal"
import PageHeading from "@src/components/ui/pageHeading"
import { trpc } from "@src/utils/trpc"
import { Fragment, useState } from "react"
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri"
import { SiBookstack } from "react-icons/si"
import { TfiMoreAlt } from "react-icons/tfi"
import Image from "next/image"
import { BookmarkIcon } from "@heroicons/react/24/outline"
import { BsCheck, BsCheckLg, BsXLg } from "react-icons/bs"
import { MdUnpublished } from "react-icons/md"

export default function Curriculum() {
  const [isOpenLevelBtn, setIsOpenLevelBtn] = useState(false)
  const [isOpenUnitBtn, setIsOpenUnitBtn] = useState(false)
  const [isOpenDeleteLevelModal, setIsOpenDeleteLevelModal] = useState(false)
  const [isOpenEditLevelModal, setIsOpenEditLevelModal] = useState(false)
  const [levelId, setLevelId] = useState<string>()
  const levels = trpc.level.getAll.useQuery()
  const deleteLevel = trpc.level.delete.useMutation()

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

  const people = [
    {
      name: "Partes del Cuerpo",
      completed: true,
      imageUrl:
        "https://images.unsplash.com/photo-1529155656340-c2c1cccb3dd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1725&q=80",
    },
    {
      name: "Ropa de Invierno",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1613299469142-fa7d42740685?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1756&q=80",
    },
  ]

  return (
    <Layout>
      <div>
        <PageHeading pageTitle="Curriculum" />
      </div>
      <div className="z-50">
        <div className="flex justify-start gap-3 my-3">
          {addLevelBtn} {addUnitBtn}
        </div>
        <nav className="h-full mt-3 overflow-y-auto" aria-label="Directory">
          {levels &&
            levels?.data?.map((level) => (
              <div key={level.id} className="relative">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 text-sm font-medium rounded-md bg-primary-800 text-primary-100">
                      {level.number}
                    </span>
                    <h3 className="text-xl font-bold text-primary-800">
                      {level.title}
                    </h3>
                    {level.published ? (
                      <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-0.5 text-sm font-medium text-accent-800 border border-accent-900 gap-2">
                        <BsCheckLg />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-0.5 text-sm font-medium text-neutral-800 border border-neutral-900 gap-1">
                        <MdUnpublished />
                        Unpublished
                      </span>
                    )}
                  </div>
                  <span className="inline-flex rounded-md shadow-sm isolate">
                    <button
                      //   onClick={handleEditModal}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border text-neutral-700 border-neutral-300 rounded-l-md hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <RiPencilLine
                        className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLevelModal(level.id)}
                      type="button"
                      className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white border text-neutral-700 border-neutral-300 rounded-r-md hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <RiDeleteBinLine
                        className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
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
                      {/* <a href="#"> */}
                      <Disclosure>
                        <Disclosure.Button
                          as="div"
                          className="flex items-center justify-between cursor-pointer"
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
                              <p className="text-2xl font-bold md:text-2xl text-primary-800">
                                {currentUnit.title}
                              </p>
                              <p className="font-bold truncate text-neutral-500">
                                Unit {currentUnit.number}
                              </p>
                              <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
                                <SiBookstack />
                                <span>12 Lessons</span>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-6 py-3 shadow-inner bg-gradient-to-l from-neutral-200 to-neutral-100 text-neutral-500">
                          <div className="flex flex-col gap-3">
                            {people.map((person) => (
                              <div
                                key={person.name}
                                className="flex justify-between"
                              >
                                <div className="relative flex items-center min-w-full p-3 space-x-3 bg-white border-2 border-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-accent-400 hover:shadow-lg">
                                  <div className="flex-shrink-0">
                                    <Image
                                      height={80}
                                      width={125}
                                      className="rounded"
                                      src={person.imageUrl}
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <a href="#" className="focus:outline-none">
                                      <span
                                        className="absolute inset-0"
                                        aria-hidden="true"
                                      />
                                      <p className="text-lg font-bold text-neutral-900">
                                        {person.name}
                                      </p>
                                    </a>
                                  </div>
                                  {person.completed ? (
                                    <div className="p-3 text-4xl text-green-500">
                                      <RiCheckboxCircleFill />
                                    </div>
                                  ) : (
                                    <div className="p-3 text-4xl text-neutral-500">
                                      <RiCheckboxBlankCircleLine />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                      {/* </a> */}
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
      {/* Edit Level Modal */}
      <Modal
        isOpen={isOpenEditLevelModal}
        setIsOpen={setIsOpenEditLevelModal}
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
    </Layout>
  )
}
