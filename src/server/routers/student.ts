import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc"
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
  entitlements: {
    select: {
      id: true,
      Level: {
        select: {
          title: true,
          number: true,
          id: true,
        },
      },
    },
  },
})

export const studentRouter = router({
  getAll: adminProcedure.query(() => {
    return prisma.student.findMany({
      orderBy: {
        studentFirstName: "asc",
      },
      select: defaultStudentSelect,
    })
  }),
  getActiveStudents: adminProcedure.query(() => {
    return prisma.student.findMany({
      where: {
        status: "Active",
      },
      select: { id: true },
    })
  }),
  getInactiveStudents: adminProcedure.query(() => {
    return prisma.student.findMany({
      where: {
        status: "Inactive",
      },
      select: { id: true },
    })
  }),
  byId: protectedProcedure
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
          entitlements: {
            select: {
              id: true,
              Level: {
                select: {
                  id: true,
                  title: true,
                  number: true,
                  Unit: {
                    orderBy: {
                      number: "asc",
                    },
                    select: {
                      photoUrl: true,
                      title: true,
                      number: true,
                      id: true,
                      published: true,
                      Level: {
                        select: {
                          title: true,
                          id: true,
                        },
                      },
                      Lesson: {
                        orderBy: {
                          number: "asc",
                        },
                        select: {
                          title: true,
                          id: true,
                          photoUrl: true,
                          number: true,
                          slidesUrl: true,
                          objective: true,
                          assignments: true,
                          published: true,
                        },
                      },
                    },
                  },
                  published: true,
                },
              },
            },
          },
        },
      })
    }),
  byTeacherId: protectedProcedure
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
  add: adminProcedure
    .input(
      z.object({
        studentFirstName: z.string(),
        studentLastName: z.string(),
        studentDateOfBirth: z.string(),
        userId: z.string(),
        status: z.string(),
        levelId: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const student = await prisma.student.create({
        data: {
          studentFirstName: input.studentFirstName,
          studentLastName: input.studentLastName,
          studentDateOfBirth: input.studentDateOfBirth,
          userId: input.userId,
          status: input.status,
        },
      })

      await Promise.all(
        input.levelId.map(async (level) => {
          await prisma.entitlements.create({
            data: {
              Student: { connect: { id: student.id } },
              Level: { connect: { id: level } },
            },
          })
        })
      )
      return true
    }),
  deleteStudent: adminProcedure
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
  editStudent: adminProcedure
    .input(
      z.object({
        studentFirstName: z.string(),
        studentLastName: z.string(),
        studentDateOfBirth: z.string(),
        userId: z.string(),
        id: z.string(),
        status: z.string(),
        levelId: z.array(z.string()),
        existingLevelIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      console.log("existinglevelids: ", input.existingLevelIds)
      console.log("levelId: ", input.levelId)
      const student = await prisma.student.update({
        where: { id: input.id },
        data: {
          studentFirstName: input.studentFirstName,
          studentLastName: input.studentLastName,
          studentDateOfBirth: input.studentDateOfBirth,
          userId: input.userId,
          id: input.id,
          status: input.status,
        },
      })

      // Compare the existing entitlements and updated entitlements
      const levelIdsToAdd = input.levelId.filter(
        (levelId) => !input.existingLevelIds.includes(levelId)
      )
      const levelIdsToRemove = input.existingLevelIds.filter(
        (levelId) => !input.levelId.includes(levelId)
      )

      // Add new entitlements
      await Promise.all(
        levelIdsToAdd.map(async (levelId) => {
          await prisma.entitlements.create({
            data: {
              Student: { connect: { id: student.id } },
              Level: { connect: { id: levelId } },
            },
          })
        })
      )

      // Remove old entitlements
      await Promise.all(
        levelIdsToRemove.map(async (levelId) => {
          await prisma.entitlements.deleteMany({
            where: { levelId: levelId, studentId: input.id },
          })
        })
      )

      return student
    }),
  getEntitlementsByStudentId: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const entitlements = await prisma.entitlements.findMany({
        where: { studentId: input.id },
        select: {
          id: true,
          Level: {
            select: {
              id: true,
              title: true,
              number: true,
              Unit: {
                orderBy: {
                  number: "asc",
                },
                select: {
                  photoUrl: true,
                  title: true,
                  number: true,
                  id: true,
                  published: true,
                  Level: {
                    select: {
                      title: true,
                      id: true,
                    },
                  },
                  Lesson: {
                    orderBy: {
                      number: "asc",
                    },
                    select: {
                      title: true,
                      id: true,
                      photoUrl: true,
                      number: true,
                      slidesUrl: true,
                      objective: true,
                      assignments: true,
                      published: true,
                    },
                  },
                },
              },
              published: true,
            },
          },
        },
      })
      return entitlements.map((entitlement: any) => entitlement.Level)
    }),
})
