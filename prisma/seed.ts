import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  // First, delete all existing data
  await db.lessonPlanComment.deleteMany()
  await db.lessonPlan.deleteMany()
  await db.assignment.deleteMany()
  await db.lesson.deleteMany()
  await db.unit.deleteMany()
  await db.entitlements.deleteMany()
  await db.student.deleteMany()
  await db.level.deleteMany()
  await db.user.deleteMany()

  // Create teachers
  const teachers = await Promise.all([
    db.user.create({
      data: {
        name: "María González",
        email: "maria@spanishforus.com",
        role: "teacher",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    }),
    db.user.create({
      data: {
        name: "Carlos Rodríguez",
        email: "carlos@spanishforus.com",
        role: "teacher",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    }),
  ])

  // Create parents
  const parents = await Promise.all([
    db.user.create({
      data: {
        name: "John Smith",
        email: "john.smith@example.com",
        role: "parent",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    }),
    db.user.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "parent",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    }),
  ])

  // Create levels
  const levels = await Promise.all([
    db.level.create({
      data: {
        title: "Beginner Spanish",
        number: 1,
        published: true,
      },
    }),
    db.level.create({
      data: {
        title: "Elementary Spanish",
        number: 2,
        published: true,
      },
    }),
    db.level.create({
      data: {
        title: "Intermediate Spanish",
        number: 3,
        published: true,
      },
    }),
  ])

  // Create students with entitlements and lesson completions
  const students = await Promise.all([
    db.student.create({
      data: {
        studentFirstName: "Emma",
        studentLastName: "Smith",
        studentDateOfBirth: "2015-03-15",
        status: "Active",
        userId: teachers[0].id,
        entitlements: {
          create: {
            levelId: levels[0].id,
          },
        },
      },
    }),
    db.student.create({
      data: {
        studentFirstName: "Lucas",
        studentLastName: "Johnson",
        studentDateOfBirth: "2014-07-22",
        status: "Active",
        userId: teachers[1].id,
        entitlements: {
          create: [{ levelId: levels[0].id }, { levelId: levels[1].id }],
        },
      },
    }),
    db.student.create({
      data: {
        studentFirstName: "Sophia",
        studentLastName: "Williams",
        studentDateOfBirth: "2016-01-10",
        status: "Active",
        userId: teachers[0].id,
        entitlements: {
          create: {
            levelId: levels[0].id,
          },
        },
      },
    }),
  ])

  // Create units for each level
  for (const level of levels) {
    await Promise.all(
      Array.from({ length: 3 }, (_, i) =>
        db.unit.create({
          data: {
            title: `Unit ${i + 1}`,
            number: i + 1,
            published: true,
            photoUrl: `https://picsum.photos/seed/${level.id}-${i}/300/200`,
            levelId: level.id,
            Lesson: {
              create: Array.from({ length: 3 }, (_, j) => ({
                title: `Lesson ${i + 1}.${j + 1}`,
                number: j + 1,
                published: true,
                photoUrl: `https://picsum.photos/seed/${level.id}-${i}-${j}/300/200`,
                slidesUrl: "https://docs.google.com/presentation/d/example",
                objective: `Learn about topic ${i + 1}.${j + 1}`,
                assignments: {
                  create: [
                    "Homework 1",
                    "Practice Exercise",
                    "Review Activity",
                  ].map((title) => ({
                    title,
                    url: "https://example.com/assignment",
                  })),
                },
              })),
            },
          },
        })
      )
    )
  }

  // Create some lesson plans
  const lessons = await db.lesson.findMany({
    take: 5,
  })

  await Promise.all(
    students.map(async (student) => {
      await Promise.all(
        lessons.map(async () => {
          await db.lessonPlan.create({
            data: {
              title: `${student.studentFirstName}'s Lesson Plan`,
              date: new Date(
                Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              slidesUrl: "https://docs.google.com/presentation/d/example",
              homeworkSent: Math.random() > 0.5,
              studentId: student.id,
              userId: teachers[Math.floor(Math.random() * teachers.length)].id,
              comments: {
                create: {
                  content: "Great progress today!",
                  userId:
                    teachers[Math.floor(Math.random() * teachers.length)].id,
                },
              },
            },
          })
        })
      )
    })
  )

  // eslint-disable-next-line no-console
  console.log({
    teachers,
    parents,
    levels,
    students,
    message: "✅ Seed data created successfully",
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

export {}
