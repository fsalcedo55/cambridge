import PageHeading from "../../components/ui/pageHeading"
import { FaChild } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { HiOutlineCollection } from "react-icons/hi"
import { IoIosPaper } from "react-icons/io"
import { ReactElement } from "react"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "admin") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: session,
    },
  }
}

interface CardProps {
  stat: number
  label: string
  icon: ReactElement
  color: string
}

function Card({ stat, label, icon, color }: CardProps) {
  return (
    <div className="flex items-center w-full gap-4 p-4 bg-white shadow rounded-xl">
      <div
        className={`flex items-center justify-center p-1 rounded h-14 w-14 ${
          color === "primary" ? "bg-primary-500 text-primary-50" : ""
        } ${color === "accent" ? "bg-accent-500 text-accent-50" : ""} ${
          color === "violet" ? "bg-violet-500 text-violet-50" : ""
        }`}
      >
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="h-14">
        <h1 className="text-base leading-6">{label}</h1>
        <h2 className="text-4xl font-bold">{stat}</h2>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const activeStudents = trpc.student.getActiveStudents.useQuery()
  const publishedLessons = trpc.lesson.getAllPublishedLessons.useQuery()
  const lessonPlans = trpc.lessonPlan.getTotalNumberOfLessonPlans.useQuery()

  return (
    <div>
      <PageHeading pageTitle="Admin Dashboard" />
      <div className="flex gap-4">
        {activeStudents.data && (
          <Card
            stat={activeStudents.data.length}
            label="Total Active Students"
            icon={<FaChild />}
            color="primary"
          />
        )}
        {publishedLessons.data && (
          <Card
            stat={publishedLessons.data}
            label="Total Published Lessons"
            icon={<HiOutlineCollection />}
            color="accent"
          />
        )}
        {lessonPlans.data != undefined && (
          <Card
            stat={lessonPlans.data}
            label="Weekly Class Total"
            icon={<IoIosPaper />}
            color="violet"
          />
        )}
      </div>
    </div>
  )
}

AdminDashboard.auth = true
