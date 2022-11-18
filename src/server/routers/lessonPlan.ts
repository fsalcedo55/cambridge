import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// const defaultLessonPlanSelect = Prisma.validator<Prisma.LessonPlanSelect>()({
//     id: true,
//     title: true,
//     date: true,
// })

export const lessonPlanRouter = router({
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.string(),
        studentId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.create({
        data: input,
      })
      return lessonPlan
    }),
  delete: publicProcedure
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
