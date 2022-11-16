import { router } from "../trpc"
import { studentRouter } from "./student"
import { teacherRouter } from "./teacher"

export const appRouter = router({
  student: studentRouter,
  teacher: teacherRouter,
})

export type AppRouter = typeof appRouter
