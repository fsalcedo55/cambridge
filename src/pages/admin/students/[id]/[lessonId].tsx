// import PageHeading from "../../components/ui/pageHeading"

import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"

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
  // const entitlement = trpc.entitlement.byLessonId.useQuery(
  //   {
  //     id: lessonId as string,
  //   },
  //   { enabled: router.isReady }
  // )

  // console.log("entitlement: ", entitlement.data)

  console.log("student: ", student.data)

  console.log("router.query: ", router.query)
  const pages = [
    { name: "Students", href: "/admin/students/", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      href: "/admin/students/[studentId]",
      current: false,
    },
    {
      name: `Level [number]: [level title] / Unit [number]: [unit title] / Lesson [number]: [lesson title]`,
      // name: `Level ${lesson.data?.Unit?.Level?.number}: ${lesson.data?.Unit?.Level?.title} / Unit ${lesson.data?.Unit?.number}: ${lesson.data?.Unit?.title} / Lesson ${lesson.data?.number}: ${lesson.data?.title}`,
      href: `/admin/curriculum/{lesson.data?.id}`,
      current: true,
    },
  ]

  return (
    <div>
      <PageHeadingWithBreadcrumb
        pages={pages}
        pageTitle={
          <div className="flex justify-between flex-1 min-w-0 space-x-4">
            {student.data?.studentFirstName} {student.data?.studentLastName}
            {/* <div className="flex items-center gap-4">
                  <Image
                    height={138.24}
                    width={200}
                    className="rounded"
                    src={lesson.data?.photoUrl!}
                    alt=""
                  />
                  <div className="flex items-center w-full gap-2">
                    <p className="text-2xl font-bold text-neutral-900">
                      {lesson.data?.title}
                    </p>
                    <div>
                      {lesson.data && (
                        <PublishedStatus
                          published={lesson.data?.published}
                          parentPublished={lesson.data?.Unit.published}
                          draftedBy="Unit"
                        />
                      )}
                    </div>
                  </div>
                </div> */}
          </div>
        }
        // loading={lesson.isLoading}
      />
      HELLO
      {/* <PageHeading pageTitle="Admin Dashboard" />
      <div className="flex gap-4 text-center">
        <div className="w-48 text-center rounded-xl h-36 bg-info/75">
          <div className="flex justify-center p-4 text-4xl">
            <FaChild />
          </div>
          <h1 className="font-bold">Total Active Students</h1>
          <h2 className="text-4xl font-bold">39</h2>
        </div>
        <div className="w-48 rounded-xl h-36 bg-secondary/75">
          <div className="flex justify-center p-4 text-4xl">
            <FaChalkboardTeacher />
          </div>
          <h1 className="font-bold">Total Teachers</h1>
          <h2 className="text-4xl font-bold">5</h2>
        </div>
      </div> */}
    </div>
  )
}

AdminStudentLessonPage.auth = true
