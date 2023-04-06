import { router, publicProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const assignmentRouter = router({
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        lessonId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const assignment = await prisma.assignment.create({
        data: input,
      })
      return assignment
    }),
  getById: publicProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const assignment = await prisma.assignment.findMany({
        where: {
          lessonId: input.lessonId,
        },
      })
      return assignment
    }),
  edit: publicProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const assignment = await prisma.assignment.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          title: input.title,
          url: input.url,
        },
      })
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lesson = await prisma.assignment.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
