import { router, adminProcedure, protectedProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const unitRouter = router({
  add: adminProcedure
    .input(
      z.object({
        title: z.string(),
        number: z.number(),
        levelId: z.string(),
        photoUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const unit = await prisma.unit.create({
        data: input,
      })
      return unit
    }),
  getById: adminProcedure
    .input(
      z.object({
        levelId: z.string(),
      })
    )
    .query(({ input }) => {
      return prisma.unit.findMany({
        where: {
          levelId: input.levelId,
        },
      })
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.unit.delete({
        where: { id: input.id },
      })
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        photoUrl: z.string(),
        number: z.number(),
        published: z.boolean(),
        levelId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const unit = await prisma.unit.update({
        where: { id: input.id },
        data: input,
      })
      return unit
    }),
  // Query to get the number of completed lessons per unit
  getCompletedLessonsPerUnit: protectedProcedure
    .input(
      z.object({
        unitId: z.string(),
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const completedLessonsCount = await prisma.lesson.findMany({
        where: {
          unitId: input.unitId,
          lessonCompletions: {
            some: {
              completedAt: {
                not: undefined,
              },
              studentId: input.studentId,
            },
          },
        },
        include: {
          lessonCompletions: true,
        },
      })

      return completedLessonsCount.length
    }),
})
