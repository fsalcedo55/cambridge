import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaExternalLinkAlt } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { HiOutlineCollection } from "react-icons/hi"
import { IoIosPaper } from "react-icons/io"
import { ReactElement } from "react"
import Divider from "@src/components/ui/Divider"
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar"
import dayjs from "dayjs"
import { RiMailSendLine } from "react-icons/ri"
import Link from "next/link"
import { LessonPlanComment } from "@prisma/client"

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
        <h2 className="text-4xl font-black">{stat}</h2>
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
      <div className="my-2 font-bold">Recent Lesson Plans</div>
      {recentLessonPlans.data &&
        recentLessonPlans.data.map((lesson, index) => {
          let str = lesson.User.name as string
          let teacherInitials = str
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "")
          return (
            <div key={lesson.id}>
              <RecentLessonPlanComponent
                title={lesson.title}
                image={lesson.User.image as string}
                teacherInitials={teacherInitials ?? "IMG"}
                studentName={`${lesson.Student.studentFirstName} ${lesson.Student.studentLastName}`}
                date={lesson.date}
                homeworkSent={lesson.homeworkSent ?? false}
                studentId={lesson.Student.id}
                slidesUrl={lesson.slidesUrl ?? ""}
                teacherName={lesson.User.name ?? "Teacher"}
                comments={lesson.comments}
              />
            </div>
          )
        })}
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
  teacherName: string
  comments: any[]
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
  teacherName,
  comments,
}: RecentLessonPlanProps) {
  return (
    <div className="mb-2 bg-white border shadow rounded-3xl border-neutral-300">
      <div className="py-4 pl-2 pr-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1 w-28">
              <Avatar>
                <AvatarImage src={`${image}`} />
                <AvatarFallback>{teacherInitials}</AvatarFallback>
              </Avatar>
              <div className="text-[12px]">{teacherName}</div>
            </div>
            <div className="w-[500px]">
              <Link
                className="flex items-center gap-2 text-lg font-bold cursor-pointer hover:underline hover:text-primary-500"
                href={`/admin/students/${studentId}`}
              >
                <span className="text-base opacity-70">
                  <FaChild />
                </span>
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
                        <span className="text-sm">{title}</span>
                        <span className="text-xs opacity-30">
                          <FaExternalLinkAlt />
                        </span>
                      </a>
                    ) : (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://${slidesUrl}`}
                        className="flex items-center gap-2 text-xs md:text-base"
                      >
                        <span className="text-sm">{title}</span>
                        <span className="text-xs opacity-30">
                          <FaExternalLinkAlt />
                        </span>
                      </a>
                    )}
                  </div>
                )}
                {!slidesUrl && <div className="text-sm">{title}</div>}
              </div>
            </div>
            {date && <span>{dayjs(date).format("dddd, MMMM D, YYYY")}</span>}
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
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment.id}>
            <div className="px-4">
              <Divider />
            </div>
            <div className="flex gap-2 px-12 py-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`${comment.User.image}`} />
                <AvatarFallback>{teacherInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 px-4 py-3 text-sm rounded-lg shadow group bg-neutral-100 text-primary-900">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{comment.User.name}</p>
                  <div className="hidden text-xs font-thin opacity-50 md:block">
                    {`${dayjs(comment.createdAt).format("MMM D, YYYY h:mma")}`}
                  </div>
                  <div className="text-xs font-thin opacity-50 md:hidden">
                    {`${dayjs(comment.createdAt).format("MMM D, 'YY")}`}
                  </div>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

AdminDashboard.auth = true
