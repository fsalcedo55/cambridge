import PageHeading from "@ui/pageHeading"
import Table from "@ui/table"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

const studentTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
]

export default function Students({ sessionSSR }: any) {
  console.log("sessionSSR", sessionSSR)
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const students = trpc.student.byTeacherId.useQuery({
    id: me.data?.id!,
  })

  console.log("students: ", students.data)

  // Formatted rows for table cells
  const formattedRows = students?.data?.map((student, idx: number) => ({
    cells: [
      { content: idx + 1 },
      {
        content: `${student.studentFirstName}`,
        href: `/teacher/students/${student.id}`,
      },
    ],
  }))

  return (
    <div>
      <PageHeading pageTitle="Students" />
      <Table headers={studentTableHeaders} rows={formattedRows} />
    </div>
  )
}

Students.auth = true
