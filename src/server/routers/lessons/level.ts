import { router, publicProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const levelRouter = router({
  add: publicProcedure
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
  getAll: publicProcedure.query(() => {
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
        },
      },
    })
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const level = await prisma.level.delete({
        where: input,
      })
    }),
})
