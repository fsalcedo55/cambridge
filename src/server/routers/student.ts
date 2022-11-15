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
  allStudents: publicProcedure.query(() => {
    return prisma.student.findMany({
      select: defaultStudentSelect,
    })
  }),
})
