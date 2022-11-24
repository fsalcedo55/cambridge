import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const userRouter = router({
  me: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(({ input }) => {
      return prisma.user.findUnique({
        where: input,
        select: {
          name: true,
          image: true,
          id: true,
        },
      })
    }),
})
