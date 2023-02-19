import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { trpc } from "@src/utils/trpc"
import { useRouter } from "next/router"
import ReactGoogleSlides from "react-google-slides"
import { BiLinkAlt } from "react-icons/bi"
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri"

interface Props {
  lessonTitle: string
}

export default function LessonPage({ lessonTitle }: Props) {
  const router = useRouter()
  const { lessonId } = router.query
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )

  const pages = [
    { name: "Curriculum", href: "/admin/curriculum/", current: false },
    {
      name: `${lesson.data?.title}`,
      href: `/admin/curriculum/${lesson.data?.id}`,
      current: true,
    },
  ]

  console.log("slug: ", router.isReady)
  console.log("lesson: ", lesson.data)
  console.log("window: ", typeof window)

  const url =
    "https://docs.google.com/presentation/d/19JRDnDauISL9PmfrjV4rewaSRIlvY7r573MLDqZ16AM"

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
          <Button size="small" intent="secondary" className="flex gap-2">
            <RiPencilLine />
            Edit Lesson
          </Button>
          <Button size="small" intent="danger" className="flex gap-2">
            <RiDeleteBinLine /> Delete Lesson
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <div>
            <div className="flex justify-between p-2 bg-white rounded-t-xl">
              <div className="text-xl font-bold">Slides</div>
              <Button size="small" intent="secondary">
                Edit
              </Button>
            </div>
            <iframe
              src={`${url}/embed?start=false&loop=false&delayms=60000`}
              frameBorder="0"
              width="480"
              height="299"
              allowFullScreen={true}
              className="flex-1"
            ></iframe>
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
              <Button size="small" intent="secondary">
                Edit
              </Button>
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
              <Button size="small" intent="secondary">
                Edit
              </Button>
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
              <Button size="small" intent="secondary">
                Edit
              </Button>
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
    </Layout>
  )
}
