import { router, publicProcedure, adminProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const levelRouter = router({
  add: adminProcedure
    .input(
      z.object({
        title: z.string(),
        number: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const level = await prisma.level.create({
        data: input,
      })
      return level
    }),
  getAll: adminProcedure.query(() => {
    return prisma.level.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        title: true,
        published: true,
        number: true,
        Unit: {
          orderBy: {
            number: "asc",
          },
          select: {
            photoUrl: true,
            title: true,
            number: true,
            id: true,
            published: true,
            Level: {
              select: {
                title: true,
                id: true,
              },
            },
            Lesson: {
              orderBy: {
                number: "asc",
              },
              select: {
                title: true,
                id: true,
                photoUrl: true,
                number: true,
                slidesUrl: true,
                objective: true,
                assignments: true,
                published: true,
              },
            },
          },
        },
      },
    })
  }),
  getLevelsReduced: adminProcedure.query(() => {
    return prisma.level.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        title: true,
        number: true,
        Unit: {
          select: {
            id: true,
          },
        },
      },
    })
  }),
  byId: adminProcedure
    .input(z.object({ id: z.array(z.string()) }))
    .query(({ input }) => {
      return prisma.level.findMany({
        orderBy: {
          number: "asc",
        },
        where: { id: { in: input.id } },
        select: {
          id: true,
          title: true,
          published: true,
          number: true,
          Unit: {
            orderBy: {
              number: "asc",
            },
            select: {
              photoUrl: true,
              title: true,
              number: true,
              id: true,
              published: true,
              Level: {
                select: {
                  title: true,
                  id: true,
                },
              },
              Lesson: {
                orderBy: {
                  number: "asc",
                },
                select: {
                  title: true,
                  id: true,
                  photoUrl: true,
                  number: true,
                  slidesUrl: true,
                  objective: true,
                  assignments: true,
                  published: true,
                },
              },
            },
          },
        },
      })
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const level = await prisma.level.delete({
        where: input,
      })
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        number: z.number(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const level = await prisma.level.update({
        where: {
          id: input.id,
        },
        data: input,
      })
      return level
    }),
})
