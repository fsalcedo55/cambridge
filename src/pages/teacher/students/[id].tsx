import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import PageHeadingWithBreadcrumb from "@ui/pageHeadingWithBreadcrumb"
import LessonPlans from "@src/components/teacher/students/LessonPlans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import CurriculumForStudent from "@src/components/teacher/curriculum/CurriculumForStudent"
import { CurriculumDisclosure } from "@src/components/curriculum/curriculumDisclosure"

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
  const { id } = router.query
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
      <nav className="h-full mt-3 overflow-y-auto" aria-label="Directory">
        <div>
          {studentEntitlements?.data && (
            <CurriculumDisclosure
              levelsArray={studentEntitlements?.data}
              studentId={student.data?.id}
              admin={false}
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
      {/* <LessonPlans me={me} /> */}
      <Tabs defaultValue="lessonPlans" className="w-full">
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
