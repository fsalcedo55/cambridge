import { router } from "../trpc"
import { studentRouter } from "./student"
import { teacherRouter } from "./teacher"
import { lessonPlanRouter } from "./lessonPlan"

export const appRouter = router({
  student: studentRouter,
  teacher: teacherRouter,
  lessonPlan: lessonPlanRouter,
})

export type AppRouter = typeof appRouter
