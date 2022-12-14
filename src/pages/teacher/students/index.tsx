import PageHeading from "@ui/pageHeading"
import Table from "@ui/table"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import Loading from "@ui/loading"
import { FiChevronRight } from "react-icons/fi"
import { useSession } from "next-auth/react"
import { getAge } from "@src/helpers/date"
import { protectPage } from "@src/services/teachers.services"

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

const studentTableHeaders = [
  { id: "header2", label: <div className="px-10">Name</div> },
]

export default function Students({ sessionSSR }: any) {
  const { data: session } = useSession()
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const students = trpc.student.byTeacherId.useQuery({
    id: me.data?.id!,
  })

  // Formatted rows for table cells
  const formattedRows = students?.data?.map((student, idx: number) => ({
    cells: [
      {
        content: (
          <div className="flex items-center justify-between px-4 rounded-lg">
            <div className="flex flex-col w-8 ml-4">
              <div className="text-lg md:text-xl">
                {student.studentFirstName} {student.studentLastName}
              </div>
              <div className="text-sm font-light md:text-md">
                {getAge(student.studentDateOfBirth, true)}
              </div>
            </div>
            <div className="text-3xl md:text-5xl">
              <FiChevronRight />
            </div>
          </div>
        ),
        href: `/teacher/students/${student.id}`,
      },
    ],
  }))

  return (
    <div>
      <PageHeading pageTitle="Students" />
      {students.isLoading ? (
        <Loading />
      ) : (
        <Table headers={studentTableHeaders} rows={formattedRows} />
      )}
    </div>
  )
}

Students.auth = true
