import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const teacherRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.user.findMany({
      where: { role: "teacher" },
    })
  }),
})
