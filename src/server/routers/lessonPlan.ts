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
  getAll: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
      })
    )
    .query(({ input }) => {
      return prisma.lessonPlan.findMany({
        where: input,
      })
    }),
})
