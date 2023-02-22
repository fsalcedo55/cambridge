import { router, publicProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lessonRouter = router({
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        number: z.number(),
        unitId: z.string(),
        photoUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lesson = await prisma.lesson.create({
        data: input,
      })
      return lesson
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: input.id,
        },
        select: {
          title: true,
          id: true,
          number: true,
          photoUrl: true,
          published: true,
          Unit: {
            select: {
              title: true,
              number: true,
              id: true,
              Level: {
                select: {
                  title: true,
                  number: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      return lesson
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lesson = await prisma.lesson.delete({
        where: {
          id: input.id,
        },
      })
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        photoUrl: z.string(),
        number: z.number(),
        unitId: z.string(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const lesson = await prisma.lesson.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          title: input.title,
          photoUrl: input.photoUrl,
          number: input.number,
          published: input.published,
          unitId: input.unitId,
        },
      })
    }),
})
