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
  status: true,
})

export const studentRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.student.findMany({
      orderBy: {
        studentFirstName: "asc",
      },
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
          status: true,
          id: true,
          lessonPlans: {
            orderBy: {
              date: "desc",
            },
            select: {
              id: true,
              title: true,
              date: true,
              slidesUrl: true,
              homeworkSent: true,
              comments: {
                select: {
                  id: true,
                  content: true,
                  User: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      })
    }),
  byTeacherId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const students = await prisma.student.findMany({
        where: {
          userId: input.id,
          status: "Active",
        },
        orderBy: {
          studentFirstName: "asc",
        },
      })
      return students
    }),
  add: publicProcedure
    .input(
      z.object({
        studentFirstName: z.string(),
        studentLastName: z.string(),
        studentDateOfBirth: z.string(),
        userId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const student = await prisma.student.create({
        data: { ...input, entitlements: { create: [{ levelId: "56" }] } },
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
        status: z.string(),
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
