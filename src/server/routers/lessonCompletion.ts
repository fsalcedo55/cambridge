import { router, publicProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lessonCompletionRouter = router({
  // Procedure to create a LessonCompletion entry
  create: publicProcedure
    .input(
      z.object({
        lessonId: z.string(),
        studentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { lessonId, studentId } = input
      return await prisma.lessonCompletion.create({
        data: {
          lessonId,
          studentId,
          // completedAt is set to current datetime by default as per model definition
        },
      })
    }),

  // Procedure to delete a LessonCompletion entry
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input
      return await prisma.lessonCompletion.delete({
        where: {
          id,
        },
      })
    }),
  getByStudentAndLesson: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        lessonId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { studentId, lessonId } = input
      return await prisma.lessonCompletion.findMany({
        where: {
          studentId: studentId,
          lessonId: lessonId,
        },
      })
    }),
})
