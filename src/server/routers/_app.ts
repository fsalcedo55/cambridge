import { router } from "../trpc"
import { studentRouter } from "./student"
import { teacherRouter } from "./teacher"
import { lessonPlanRouter } from "./lessonPlan/index"
import { lessonPlanCommentRouter } from "./lessonPlan/lessonPlanComment"

export const appRouter = router({
  student: studentRouter,
  teacher: teacherRouter,
  lessonPlan: lessonPlanRouter,
  lessonPlanComment: lessonPlanCommentRouter,
})

export type AppRouter = typeof appRouter
