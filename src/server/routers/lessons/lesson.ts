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
})
