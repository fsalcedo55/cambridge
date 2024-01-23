import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import PageHeadingWithBreadcrumb from "@ui/pageHeadingWithBreadcrumb"
import LessonPlans from "@src/components/teacher/students/LessonPlans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import CurriculumForStudent from "@src/components/teacher/curriculum/CurriculumForStudent"
import { CurriculumDisclosure } from "@src/components/curriculum/curriculumDisclosure"
import { useEffect } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "teacher") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function TeacherStudentPage({ sessionSSR }: any) {
  const router = useRouter()
  const { id, tab } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const studentEntitlements = trpc.student.getEntitlementsByStudentId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const lessonCompletion =
    trpc.lessonCompletion.getAllLessonCompletionsByStudentId.useQuery(
      {
        studentId: id as string,
      },
      {
        enabled: !!id,
      }
    )

  console.log("tab: ", tab)

  useEffect(() => {
    if (!tab) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: "lessonPlans" },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [tab, router])

  const handleTabChange = (newTab: string) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: newTab },
      },
      undefined,
      { shallow: true }
    )
  }

  const pages = [
    { name: "Students", href: "/teacher/students", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      href: `/teacher/students/${student.data?.id}`,
      current: true,
    },
  ]

  const tabPanel = (
    <div>
      <nav
        className="h-full mt-3 overflow-y-auto rounded-3xl"
        aria-label="Directory"
      >
        <div>
          {studentEntitlements?.data && (
            <CurriculumDisclosure
              levelsArray={studentEntitlements?.data}
              studentId={student.data?.id}
              admin={false}
              lessonCompletions={lessonCompletion.data}
            />
          )}
        </div>
      </nav>
    </div>
  )

  return (
    <div>
      <PageHeadingWithBreadcrumb
        pages={pages}
        pageTitle={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
        loading={student.isLoading}
      />
      <Tabs
        defaultValue={(tab as string) || "lessonPlans"}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="lessonPlans">Lesson Plans</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        </TabsList>
        <TabsContent value="lessonPlans">
          <LessonPlans me={me} />
        </TabsContent>
        <TabsContent value="curriculum">
          {tabPanel}
          {/* <CurriculumForStudent /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

TeacherStudentPage.auth = true
