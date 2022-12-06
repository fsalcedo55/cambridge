import PageHeading from "@ui/pageHeading"
import Table from "@ui/table"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import Loading from "@ui/loading"
import { FiChevronRight } from "react-icons/fi"
import dayjs from "dayjs"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
  const dayjs = require("dayjs")
  const relativeTime = require("dayjs/plugin/relativeTime")
  dayjs.extend(relativeTime)
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
              <div className="text-xl">
                {student.studentFirstName} {student.studentLastName}
              </div>
              <div className="font-light">
                {dayjs().from(dayjs(student.studentDateOfBirth), true)}
              </div>
            </div>
            <div className="text-5xl">
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
