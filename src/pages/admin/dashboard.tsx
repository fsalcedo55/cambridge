import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaExternalLinkAlt } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { HiOutlineCollection } from "react-icons/hi"
import { IoIosPaper } from "react-icons/io"
import { ReactElement } from "react"
import Table from "@src/components/ui/table"
import Divider from "@src/components/ui/Divider"
import LessonPlans from "@src/components/teacher/students/LessonPlans"
import LessonPlan from "@src/components/lessonPlan"
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar"
import { ImCalendar } from "react-icons/im"
import dayjs from "dayjs"
import { RiMailSendLine } from "react-icons/ri"
import Link from "next/link"
import { Button } from "@src/components/ui/button"

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
  const recentLessonPlans = trpc.lessonPlan.getRecentLessonPlans.useQuery()

  console.log("recentLessonPlans: ", recentLessonPlans.data)

  const tableHeaders = [
    { label: "Date", importance: 1 },
    { label: "Student", importance: 2 },
    { label: "Class", importance: 3 },
    { label: "Teacher", importance: 4 },
    { label: "Comments", importance: 5 },
  ]

  const tableRows = [
    {
      date: "2021-10-01",
      student: "John Doe",
      class: "Math",
      teacher: "Mr. Smith",
      comments: "Good job",
    },
    {
      date: "2021-10-02",
      student: "Jane Doe",
      class: "Science",
      teacher: "Ms. Smith",
      comments: "Good job",
    },
    {
      date: "2021-10-03",
      student: "John Doe",
      class: "Math",
      teacher: "Mr. Smith",
      comments: "Good job",
    },
    {
      date: "2021-10-04",
      student: "Jane Doe",
      class: "Science",
      teacher: "Ms. Smith",
      comments: "Good job",
    },
    {
      date: "2021-10-05",
      student: "John Doe",
      class: "Math",
      teacher: "Mr. Smith",
      comments: "Good job",
    },
    {
      date: "2021-10-06",
      student: "Jane Doe",
      class: "Science",
      teacher: "Ms. Smith",
      comments: "Good job",
    },
  ]

  function getMoreLessons() {
    trpc.lessonPlan.getRecentLessonPlans.useQuery()
  }

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
      <div className="h-4"></div>
      {recentLessonPlans.data &&
        recentLessonPlans.data.map((lesson) => {
          let str = lesson.User.name as string
          let teacherInitials = str
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "")
          return (
            <div key={lesson.id} className="my-2">
              <RecentLessonPlanComponent
                title={lesson.title}
                image={lesson.User.image as string}
                teacherInitials={teacherInitials ?? "IMG"}
                studentName={`${lesson.Student.studentFirstName} ${lesson.Student.studentLastName}`}
                date={lesson.date}
                homeworkSent={lesson.homeworkSent ?? false}
                studentId={lesson.Student.id}
                slidesUrl={lesson.slidesUrl ?? ""}
              />
            </div>
          )
        })}
      <Button onClick={getMoreLessons}>Get more lessons</Button>
    </div>
  )
}

interface RecentLessonPlanProps {
  title: string
  image: string
  teacherInitials: string
  studentName: string
  date: string
  homeworkSent: boolean
  studentId: string
  slidesUrl: string
}

function RecentLessonPlanComponent({
  title,
  image,
  teacherInitials,
  studentName,
  date,
  homeworkSent,
  studentId,
  slidesUrl,
}: RecentLessonPlanProps) {
  console.log("image: ", typeof image)
  console.log("image githsub: ", typeof "https://github.com/shadcn.png")
  return (
    <div className="my-6">
      {date && (
        <div className="flex items-center gap-1 mb-1 text-sm text-neutral-400 md:text-md">
          <span>
            <ImCalendar />
          </span>
          <span>{dayjs(date).format("dddd, MMMM D, YYYY")}</span>
        </div>
      )}
      <div className="flex items-center justify-between w-full p-2 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 ">
          <Avatar>
            <AvatarImage src={`${image}`} />
            <AvatarFallback>{teacherInitials}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              className="text-xl font-extrabold cursor-pointer hover:underline hover:text-primary-500"
              href={`/admin/students/${studentId}`}
            >
              {studentName}
            </Link>
            <div>
              {slidesUrl && (
                <div className="h-full cursor-pointer hover:underline">
                  {slidesUrl?.startsWith("http") ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={slidesUrl}
                      className="flex items-center gap-2 text-xs md:text-base"
                    >
                      <span>{title}</span>
                      <FaExternalLinkAlt />
                    </a>
                  ) : (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${slidesUrl}`}
                      className="flex items-center gap-2 text-xs md:text-base"
                    >
                      <span>{title}</span>
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              )}

              {!slidesUrl && title}
            </div>
          </div>
        </div>
        <div>
          {homeworkSent && (
            <span className="h-8 inline-flex items-center rounded-full bg-accent-100 px-2 md:px-3 py-0.5 text-xs md:text-sm font-medium text-accent-800 gap-1 md:gap-2">
              <RiMailSendLine />
              Homework Sent
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

AdminDashboard.auth = true
