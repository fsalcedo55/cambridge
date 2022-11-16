import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const defaultStudentSelect = Prisma.validator<Prisma.StudentSelect>()({
  studentFirstName: true,
  studentLastName: true,
  studentDateOfBirth: true,
  userId: true,
  teacher: true,
  id: true,
})

export const studentRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.student.findMany({
      select: defaultStudentSelect,
    })
  }),
  add: publicProcedure
    .input(
      z.object({
        studentFirstName: z.string(),
        studentLastName: z.string(),
        studentDateOfBirth: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const teacher = await prisma.student.create({
        data: input,
      })
      return teacher
    }),
})
