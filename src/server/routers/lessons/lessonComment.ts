import { PrismaClient } from "@prisma/client"
import { protectedProcedure, router } from "@src/server/trpc"
import { z } from "zod"

const prisma = new PrismaClient()
export const lessonCommentRouter = router({
  addComment: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        userId: z.string(),
        content: z.string(),
        createdAt: z.string(),
        studentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.lessonComment.create({
        data: input,
      })
      return comment
    }),
  getCommentsByLessonAndStudent: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const comments = await prisma.lessonComment.findMany({
        where: {
          lessonId: input.lessonId,
          studentId: input.studentId,
        },
        select: {
          id: true,
          lessonId: true,
          userId: true,
          content: true,
          createdAt: true,
          studentId: true,
          User: {
            select: {
              id: true,
              email: true,
              role: true,
              name: true,
              image: true,
            },
          },
        },
      })
      return comments
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.lessonComment.delete({
        where: {
          id: input.commentId,
        },
      })
    }),
})
