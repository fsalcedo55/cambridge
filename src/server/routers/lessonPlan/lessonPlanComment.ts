import { router, protectedProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lessonPlanCommentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        lessonPlanId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.lessonPlanComment.create({
        data: input,
      })
      return comment
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.lessonPlanComment.delete({
        where: { id: input.id },
      })
    }),
})
