import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await addLessonPlan(req, res)
  } else if (req.method === "GET") {
    return await getLessonPlans(req, res)
  } else if (req.method === "DELETE") {
    return await deleteLessonPlan(req, res)
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false })
  }
}

async function addLessonPlan(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  console.log({ body })
  try {
    const newLessonPlan = await prisma.lessonPlan.create({
      data: {
        title: body.title,
        date: body.date,
        studentId: body.studentId,
        userId: body.userId,
      },
    })
    return res.status(200).json({ success: true, ...newLessonPlan })
  } catch (error) {
    console.log(error)
  }
}

async function getLessonPlans(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    const lessonPlans = await prisma.lessonPlan.findMany({
      where: { studentId: String(id) },
    })
    return res.status(200).json({ success: true, lessonPlans })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error fetching lesson plans from database",
      success: false,
    })
  }
}

async function deleteLessonPlan(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  try {
    const lessonPlan = await prisma.lessonPlan.delete({
      where: { id: body.lessonPlan.id },
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
  }
}
