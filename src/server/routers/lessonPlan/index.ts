import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../../trpc"
import { z } from "zod"
import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lessonPlanRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.string(),
        slidesUrl: z.string().optional().nullish(),
        studentId: z.string(),
        userId: z.string(),
        homeworkSent: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.create({
        data: input,
      })

      return lessonPlan
    }),
  edit: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        id: z.string(),
        slidesUrl: z.string().optional(),
        homeworkSent: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.update({
        where: { id: input.id },
        data: input,
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lessonPlan = await prisma.lessonPlan.delete({
        where: input,
      })
    }),
  getTotalNumberOfLessonPlans: adminProcedure.query(async () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const lessonPlans = await prisma.lessonPlan.findMany({
      where: {
        date: {
          gte: sevenDaysAgo.toISOString().split("T")[0],
        },
      },
    })
    return lessonPlans.length
  }),
  getRecentLessonPlans: adminProcedure.query(async () => {
    const lessonPlans = await prisma.lessonPlan.findMany({
      take: 20,
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
            createdAt: true,
            content: true,
            User: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        Student: {
          select: {
            id: true,
            studentFirstName: true,
            studentLastName: true,
          },
        },
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    const groupedByDate = lessonPlans.reduce(
      (acc: { [key: string]: any[] }, lessonPlan) => {
        const date = lessonPlan.date.split("T")[0]
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(lessonPlan)
        return acc
      },
      {}
    )

    return groupedByDate
  }),
  getRecentLessonPlansByTeacherId: adminProcedure
    .input(
      z.object({
        teacherId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const lessonPlans = await prisma.lessonPlan.findMany({
        where: { userId: input.teacherId },
        take: 20,
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
              createdAt: true,
              content: true,
              User: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          Student: {
            select: {
              id: true,
              studentFirstName: true,
              studentLastName: true,
            },
          },
          User: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      })

      const groupedByDate = lessonPlans.reduce(
        (acc: { [key: string]: any[] }, lessonPlan) => {
          const date = lessonPlan.date.split("T")[0]
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(lessonPlan)
          return acc
        },
        {}
      )

      return groupedByDate
    }),
})
