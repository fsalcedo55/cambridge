import { router } from "../trpc"
import { studentRouter } from "./student"
import { teacherRouter } from "./teacher"
import { lessonPlanRouter } from "./lessonPlan/index"
import { lessonPlanCommentRouter } from "./lessonPlan/lessonPlanComment"
import { userRouter } from "./user"
import { levelRouter } from "./lessons/level"
import { unitRouter } from "./lessons/unit"
import { lessonRouter } from "./lessons/lesson"
import { assignmentRouter } from "./lessons/assignment"
import { lessonCompletionRouter } from "./lessonCompletion"
import { lessonCommentRouter } from "./lessons/lessonComment"

export const appRouter = router({
  student: studentRouter,
  teacher: teacherRouter,
  lessonPlan: lessonPlanRouter,
  lessonPlanComment: lessonPlanCommentRouter,
  user: userRouter,
  level: levelRouter,
  unit: unitRouter,
  lesson: lessonRouter,
  assignment: assignmentRouter,
  lessonCompletion: lessonCompletionRouter,
  lessonComment: lessonCommentRouter,
})

export type AppRouter = typeof appRouter
