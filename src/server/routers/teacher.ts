import { router, publicProcedure, adminProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const teacherRouter = router({
  getAll: adminProcedure.query(() => {
    return prisma.user.findMany({
      where: {
        role: "teacher",
        // students: {
        //   some: {
        //     status: "active",
        //   },
        // },
      },
    })
  }),
})
