import { router, publicProcedure } from "@src/server/trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const unitRouter = router({
  add: publicProcedure
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
  getById: publicProcedure
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
  deleteById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const unit = await prisma.unit.delete({
        where: { id: input.id },
      })
    }),
})
