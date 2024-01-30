import { router, publicProcedure, protectedProcedure } from "../../trpc"
import { z } from "zod"
import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lessonPlanRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.string(),
        slidesUrl: z.string().optional().nullish(),
        studentId: z.string(),
        userId: z.string(),
        homeworkSent: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.create({
        data: input,
      })

      return lessonPlan
    }),
  edit: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.string(),
        id: z.string(),
        slidesUrl: z.string().optional(),
        homeworkSent: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.update({
        where: { id: input.id },
        data: input,
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.delete({
        where: input,
      })
    }),
})
