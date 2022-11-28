import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import PageHeading from "@src/components/ui/pageHeading"
import Breadcrumbs from "@src/components/ui/breadcrumbs"

export default function TeacherStudentPage() {
  const router = useRouter()
  const { id } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )

  return (
    <div>
      <Breadcrumbs />
      <PageHeading pageTitle={student.data?.studentFirstName} />
    </div>
  )
}

TeacherStudentPage.auth = true
