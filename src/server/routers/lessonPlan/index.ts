import { router, protectedProcedure, adminProcedure } from "../../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { sendLessonPlanNotificationEmail } from "../../../utils/email"
import { logger } from "../../../utils/logger"

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
      // Create the lesson plan
      const lessonPlan = await prisma.lessonPlan.create({
        data: input,
        include: {
          User: {
            select: {
              name: true,
            },
          },
          Student: {
            select: {
              id: true,
              studentFirstName: true,
              studentLastName: true,
            },
          },
        },
      })

      // Send email notification to admin
      try {
        // Only proceed if we have the teacher and student information
        if (lessonPlan.User && lessonPlan.Student) {
          const teacherName = lessonPlan.User.name || 'Unknown Teacher';
          const studentName = `${lessonPlan.Student.studentFirstName} ${lessonPlan.Student.studentLastName}`;
          
          await sendLessonPlanNotificationEmail({
            teacherName,
            lessonPlanTitle: lessonPlan.title,
            lessonPlanId: lessonPlan.id,
            studentId: lessonPlan.Student.id,
            studentName,
            lessonDate: lessonPlan.date,
            slidesUrl: lessonPlan.slidesUrl,
          });
        } else {
          logger.warn('Missing teacher or student information for email notification', { 
            lessonPlanId: lessonPlan.id, 
            userId: input.userId, 
            studentId: input.studentId 
          });
        }
      } catch (error) {
        // Log the error but don't fail the mutation
        logger.error('Failed to send lesson plan notification email', { 
          error, 
          lessonPlanId: lessonPlan.id 
        });
      }

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
      return lessonPlan
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.lessonPlan.delete({
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

    const groupedByDate = lessonPlans.reduce<
      Record<string, typeof lessonPlans>
    >((acc, lessonPlan) => {
      const date = lessonPlan.date.split("T")[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(lessonPlan)
      return acc
    }, {})

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

      const groupedByDate = lessonPlans.reduce<
        Record<string, typeof lessonPlans>
      >((acc, lessonPlan) => {
        const date = lessonPlan.date.split("T")[0]
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(lessonPlan)
        return acc
      }, {})

      return groupedByDate
    }),
})
