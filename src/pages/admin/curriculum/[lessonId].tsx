import EditLesson from "@src/components/admin/lessons/EditLesson"
import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import Modal from "@src/components/ui/modal"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { trpc } from "@src/utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"
import { BiLinkAlt } from "react-icons/bi"
import { RiDeleteBinLine, RiPencilLine, RiSlideshowLine } from "react-icons/ri"

interface Props {
  lessonTitle: string
  levels: any
}

export default function LessonPage({ lessonTitle, levels }: Props) {
  const router = useRouter()
  const { lessonId } = router.query
  const [isOpenDeleteLessonModal, setIsOpenDeleteLessonModal] = useState(false)
  const [isOpenEditLessonModal, setIsOpenEditLessonModal] = useState(false)
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )
  const deleteLesson = trpc.lesson.delete.useMutation()
  const editLesson = trpc.lesson.edit.useMutation()

  const handleEditLessonModal = async () => {
    setIsOpenEditLessonModal(true)
  }

  const editLessonEvent = async () => {
    try {
      // await editLesson.mutateAsync({
      //   id: lessonId as string,
      // })
    } catch (error) {
      console.log("Error editing lesson.", error)
    }
  }

  const handleDeleteLessonModal = async () => {
    setIsOpenDeleteLessonModal(true)
  }

  const deleteLessonEvent = async () => {
    try {
      await deleteLesson.mutateAsync({
        id: lessonId as string,
      })
    } catch (error) {
      console.log("Error deleting lesson.", error)
    }
    router.push("/admin/curriculum")
  }

  const pages = [
    { name: "Curriculum", href: "/admin/curriculum/", current: false },
    {
      name: `Level ${lesson.data?.Unit?.Level?.number}: ${lesson.data?.Unit?.Level?.title} / Unit ${lesson.data?.Unit?.number}: ${lesson.data?.Unit?.title} / Lesson ${lesson.data?.number}: ${lesson.data?.title}`,
      href: `/admin/curriculum/${lesson.data?.id}`,
      current: true,
    },
  ]

  // const url =
  //   "https://docs.google.com/presentation/d/19JRDnDauISL9PmfrjV4rewaSRIlvY7r573MLDqZ16AM"

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <PageHeadingWithBreadcrumb
            pages={pages}
            pageTitle={lesson.data?.title}
            loading={lesson.isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOpenEditLessonModal(true)}
            size="small"
            intent="secondary"
            className="flex gap-2"
          >
            <RiPencilLine />
            Edit Lesson
          </Button>
          <Button
            size="small"
            intent="danger"
            className="flex gap-2"
            onClick={() => setIsOpenDeleteLessonModal(true)}
          >
            <RiDeleteBinLine /> Delete Lesson
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <div>
            <div className="flex justify-between p-2 bg-white rounded-t-xl">
              <div className="text-xl font-bold">Slides</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="w-[480px] h-[299px] bg-neutral-200 rounded-b-xl flex items-center justify-center">
              {lesson.data?.slidesUrl ? (
                <iframe
                  src={`${lesson.data?.slidesUrl}/embed?start=false&loop=false&delayms=60000`}
                  frameBorder="0"
                  width="480"
                  height="299"
                  allowFullScreen={true}
                  className="flex-1"
                ></iframe>
              ) : (
                <div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="opacity-50 text-8xl">
                      <RiSlideshowLine />
                    </div>
                    <div className="font-bold">
                      Add slides URL to see the content
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="py-2 text-xl font-bold">Feedback</div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">Feedback goes here</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Lesson Objective</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">
              In this class, students will learn how to describe different
              actions that animals can do in Spanish.
            </div>
          </div>

          <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Assignments</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">
              {" "}
              <fieldset>
                <legend className="sr-only">Notifications</legend>
                <div>
                  <div className="relative flex items-start p-2 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <div className="flex items-center min-w-0 gap-1">
                      <label htmlFor="comments">Tarea 1</label>
                      <div className="opacity-50">
                        <BiLinkAlt />
                      </div>
                    </div>
                  </div>
                  <div className="relative flex items-start p-2 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <div className="flex items-center min-w-0 gap-1">
                      <label htmlFor="candidates">Tarea 2</label>
                      <div className="opacity-50">
                        <BiLinkAlt />
                      </div>
                    </div>
                  </div>
                  <div className="relative flex items-start p-2 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <div className="flex items-center min-w-0 gap-1">
                      <label htmlFor="offers">Tarea 3</label>
                      <div className="opacity-50">
                        <BiLinkAlt />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Extra Resources</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">Links to resources go here</div>
          </div>
        </div>
      </div>
      {/* Delete Lesson Modal */}
      <Modal
        isOpen={isOpenDeleteLessonModal}
        setIsOpen={setIsOpenDeleteLessonModal}
        actionFunction={deleteLessonEvent}
        loading={deleteLesson.isLoading}
        btnIntent="danger"
        actionButton="Delete"
        loadingLabel="Deleting Lesson..."
        title="Delete Lesson"
        description={
          <div>
            <p className="mt-2">Are you sure you want to delete this lesson?</p>
          </div>
        }
        closeButton="Cancel"
      />
      {/* Edit Lesson Modal */}
      <Modal
        isOpen={isOpenEditLessonModal}
        setIsOpen={setIsOpenEditLessonModal}
        actionFunction={editLessonEvent}
        loading={editLesson.isLoading}
        loadingLabel="Updating Lesson..."
        title="Edit Lesson"
        description={
          <EditLesson
            currentLesson={lesson}
            closeModal={() => setIsOpenEditLessonModal(false)}
          />
        }
        closeButton="Cancel"
      />
    </Layout>
  )
}
