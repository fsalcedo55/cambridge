// import PageHeading from "../../components/ui/pageHeading"

import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import {
  LessonInfo,
  SlideComponent,
} from "@src/components/lessonDetails/LessonDetails"
import Container from "@src/components/ui/Container"
import { MdDescription } from "react-icons/md"
import Link from "next/link"
import Divider from "@src/components/ui/Divider"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "admin") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function AdminStudentLessonPage() {
  const router = useRouter()
  const { lessonId } = router.query
  const { id } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )
  const assignments = trpc.assignment.getById.useQuery(
    { lessonId: lessonId as string },
    { enabled: router.isReady }
  )

  const pages = [
    { name: "Students", href: "/admin/students/", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      current: false,
    },
    {
      name: `Level ${lesson.data?.Unit?.Level?.number}: ${lesson.data?.Unit?.Level?.title}  / Unit ${lesson.data?.Unit?.number}: ${lesson.data?.Unit?.title} / Lesson ${lesson.data?.number}: ${lesson.data?.title}`,
      current: true,
    },
  ]

  return (
    <div>
      <PageHeadingWithBreadcrumb
        pages={pages}
        pageTitle={<LessonInfo lesson={lesson} edit={false} />}
        loading={lesson.isLoading}
      />
      <div className="flex gap-4">
        <div>
          <SlideComponent lesson={lesson} admin={false} />
        </div>
        <div className="flex-1">
          <Container title="Lesson Objective">
            {lesson?.data?.objective?.length! > 0 ? (
              lesson.data?.objective
            ) : (
              <div className="flex items-center justify-center">
                <div>
                  <div className="flex justify-center mb-2 text-5xl opacity-50">
                    <MdDescription />
                  </div>
                  <div>Add an Objective</div>
                </div>
              </div>
            )}
          </Container>
          <div className="h-4"></div>
          <Container title="Assignments">
            <fieldset>
              <div>
                <div className="relative flex items-start"></div>
                <div className="relative items-start">
                  {assignments.data?.map((assignment: any) => (
                    <div
                      className="flex flex-col border border-white border-opacity-0 rounded-lg hover:shadow-lg hover:border hover:border-neutral-200 group/assignment"
                      key={assignment.id}
                    >
                      <div className="flex items-center justify-between my-1">
                        <Link href={assignment.url} target="_blank" rel="noopener noreferrer">

                          <div className="flex items-center min-w-0 gap-1 pl-2 cursor-pointer hover:underline">
                            <div className="font-bold">
                              {assignment.title}
                            </div>
                          </div>

                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </fieldset>
          </Container>
        </div>
      </div>
      <div className="h-4"></div>
      {/* <Container title="Feedback"></Container> */}
    </div>
  );
}

AdminStudentLessonPage.auth = true
