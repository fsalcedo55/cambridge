import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaExternalLinkAlt } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { HiOutlineCollection } from "react-icons/hi"
import { IoIosPaper } from "react-icons/io"
import { ReactElement, useState } from "react"
import Divider from "@src/components/ui/Divider"
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar"
import dayjs from "dayjs"
import { RiMailSendLine } from "react-icons/ri"
import Link from "next/link"
import { ImCalendar } from "react-icons/im"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs"

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
    <div className="flex items-center w-full gap-4 p-4 border-r border-neutral-50">
      <div className="text-5xl text-primary-50">{icon}</div>
      <div className="h-14">
        <h1 className="text-base leading-6 text-primary-50">{label}</h1>
        <h2 className="text-4xl font-black text-primary-50">{stat}</h2>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [teacherId, setTeacherId] = useState<string>("")
  const activeStudents = trpc.student.getActiveStudents.useQuery()
  const publishedLessons = trpc.lesson.getAllPublishedLessons.useQuery()
  const lessonPlans = trpc.lessonPlan.getTotalNumberOfLessonPlans.useQuery()
  const recentLessonPlans = trpc.lessonPlan.getRecentLessonPlans.useQuery()
  const teachers = trpc.teacher.getAll.useQuery()
  const recentLessonPlansByTeacherId =
    trpc.lessonPlan.getRecentLessonPlansByTeacherId.useQuery({
      teacherId,
    })

  const handleTabChange = (teacherId: string) => {
    setTeacherId(teacherId)
  }

  console.log(
    "recentLessonPlansByTeacherId: ",
    recentLessonPlansByTeacherId.data
  )

  return (
    <div>
      <PageHeading pageTitle="Admin Dashboard" />
      <div className="flex gap-4 rounded-xl bg-primary-500">
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
      <div className="h-8"></div>
      <div className="font-bold">Recent Lesson Plans</div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="all">
            <div className="flex items-center gap-2">All</div>
          </TabsTrigger>
          {teachers.data &&
            teachers.data.map((teacher) => {
              const teacherId = teacher.id

              if (teacherId) {
                return (
                  <TabsTrigger value={teacherId}>
                    <div className="flex items-center gap-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`${teacher.image}`} />
                        <AvatarFallback>{teacher.name}</AvatarFallback>
                      </Avatar>
                      {teacher.name}
                    </div>
                  </TabsTrigger>
                )
              }
            })}
        </TabsList>
        <TabsContent value="all">
          {recentLessonPlans.data &&
            Object.entries(recentLessonPlans.data).map(([date, lessons]) => (
              <div key={date}>
                <div className="flex items-center gap-2 pt-4 pb-1">
                  <span className="text-2xl">
                    <ImCalendar />
                  </span>
                  <span className="text-lg font-bold">
                    {dayjs(date).format("dddd, MMMM D, YYYY")}
                  </span>
                </div>
                <ul>
                  {lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <RecentLessonPlanComponent
                        title={lesson.title}
                        image={lesson.User.image as string}
                        studentName={`${lesson.Student.studentFirstName} ${lesson.Student.studentLastName}`}
                        date={lesson.date}
                        homeworkSent={lesson.homeworkSent ?? false}
                        studentId={lesson.Student.id}
                        slidesUrl={lesson.slidesUrl ?? ""}
                        teacherName={lesson.User.name ?? "Teacher"}
                        comments={lesson.comments}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </TabsContent>

        {teachers.data &&
          teachers.data.map((teacher) => {
            const teacherId = teacher.id

            if (teacherId) {
              return (
                <TabsContent value={teacherId}>
                  {recentLessonPlansByTeacherId.data &&
                    Object.entries(recentLessonPlansByTeacherId.data).map(
                      ([date, lessons]) => (
                        <div key={date}>
                          <div className="flex items-center gap-2 pt-4 pb-1">
                            <span className="text-2xl">
                              <ImCalendar />
                            </span>
                            <span className="text-lg font-bold">
                              {dayjs(date).format("dddd, MMMM D, YYYY")}
                            </span>
                          </div>
                          <ul>
                            {lessons.map((lesson) => (
                              <li key={lesson.id}>
                                <RecentLessonPlanComponent
                                  title={lesson.title}
                                  image={lesson.User.image as string}
                                  studentName={`${lesson.Student.studentFirstName} ${lesson.Student.studentLastName}`}
                                  date={lesson.date}
                                  homeworkSent={lesson.homeworkSent ?? false}
                                  studentId={lesson.Student.id}
                                  slidesUrl={lesson.slidesUrl ?? ""}
                                  teacherName={lesson.User.name ?? "Teacher"}
                                  comments={lesson.comments}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                </TabsContent>
              )
            }
          })}
      </Tabs>
    </div>
  )
}

interface RecentLessonPlanProps {
  title: string
  image: string
  teacherInitials?: string
  studentName: string
  date?: string
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
    <div className="mb-3 bg-white border shadow rounded-3xl border-neutral-300">
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
                className="flex items-center gap-2 text-lg font-bold cursor-pointer hover:underline hover:text-primary-500 max-w-fit"
                href={`/admin/students/${studentId}`}
              >
                <span className="text-base opacity-70">
                  <FaChild />
                </span>
                {studentName}
              </Link>
              <div>
                {slidesUrl && (
                  <div className="h-full">
                    {slidesUrl?.startsWith("http") ? (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={slidesUrl}
                        className="flex items-center gap-2 text-xs cursor-pointer hover:text-primary-500 hover:underline md:text-base max-w-fit"
                      >
                        <span>{title}</span>
                        <span className="text-xs opacity-30">
                          <FaExternalLinkAlt />
                        </span>
                      </a>
                    ) : (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://${slidesUrl}`}
                        className="flex items-center gap-2 text-xs cursor-pointer md:text-base hover:text-primary-500 hover:underline"
                      >
                        <span>{title}</span>
                        <span className="text-xs opacity-30">
                          <FaExternalLinkAlt />
                        </span>
                      </a>
                    )}
                  </div>
                )}
                {!slidesUrl && <div>{title}</div>}
              </div>
            </div>
            {/* {date && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <ImCalendar />
                </span>
                <span className="text-lg font-bold">
                  {dayjs(date).format("dddd, MMMM D, YYYY")}
                </span>
              </div>
            )} */}
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
      {comments && comments.length > 0 && (
        <div className="px-4">
          <Divider />
        </div>
      )}
      {comments && comments.length > 0 && (
        <div className="py-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex gap-2 px-12 py-[5px]">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`${comment.User.image}`} />
                  <AvatarFallback>{teacherInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 px-4 py-3 text-sm rounded-lg shadow group bg-neutral-100 text-primary-900">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{comment.User.name}</p>
                    <div className="hidden text-xs font-thin opacity-50 md:block">
                      {`${dayjs(comment.createdAt).format(
                        "MMM D, YYYY h:mma"
                      )}`}
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
      )}
    </div>
  )
}

AdminDashboard.auth = true
