import { router, protectedProcedure, adminProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const userRouter = router({
  me: protectedProcedure
    .input(
      z.object({
        email: z.string().optional(),
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
  getAll: adminProcedure.query(() => {
    return prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        image: true,
        id: true,
      },
      orderBy: {
        role: "asc",
      },
    })
  }),
  editUser: adminProcedure
    .input(
      z.object({
        role: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
      })
      return user
    }),
})
