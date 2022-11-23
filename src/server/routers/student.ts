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
  lessonPlans: true,
})

export const studentRouter = router({
  getAll: publicProcedure.query(({ input }) => {
    return prisma.student.findMany({
      select: defaultStudentSelect,
    })
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      return prisma.student.findUnique({
        where: input,
        select: {
          studentFirstName: true,
          studentLastName: true,
          studentDateOfBirth: true,
          userId: true,
          teacher: true,
          id: true,
          lessonPlans: true,
        },
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
      const student = await prisma.student.create({
        data: input,
      })
      return student
    }),
  deleteStudent: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const student = await prisma.student.delete({
        where: input,
      })
    }),
  editStudent: publicProcedure
    .input(
      z.object({
        studentFirstName: z.string(),
        studentLastName: z.string(),
        studentDateOfBirth: z.string(),
        userId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const student = await prisma.student.update({
        where: { id: input.id },
        data: input,
      })
      return student
    }),
})
