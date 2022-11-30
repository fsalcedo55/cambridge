import PageHeading from "@ui/pageHeading"
import Table from "@ui/table"
import { trpc } from "@src/utils/trpc"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import Loading from "@ui/loading"

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
  { id: "header3", label: "Age" },
]

export default function Students({ sessionSSR }: any) {
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const students = trpc.student.byTeacherId.useQuery({
    id: me.data?.id!,
  })

  // Formatted rows for table cells
  const formattedRows = students?.data?.map((student, idx: number) => ({
    cells: [
      { content: idx + 1 },
      {
        content: `${student.studentFirstName} ${student.studentLastName}`,
        href: `/teacher/students/${student.id}`,
      },
      {
        content: `${student.studentDateOfBirth}`,
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
