import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await addStudent(req, res)
  } else if (req.method === "GET") {
    return await getAllStudents(req, res)
  } else if (req.method === "DELETE") {
    return await deleteStudent(req, res)
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false })
  }
}

async function getAllStudents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allStudents = await prisma.student.findMany({
      select: {
        studentFirstName: true,
        studentLastName: true,
        studentDateOfBirth: true,
        userId: true,
        teacher: true,
        id: true,
      },
    })
    return res.status(200).json({ success: true, allStudents })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: "Error fetching students from database", success: false })
  }
}

async function addStudent(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  try {
    const newEntry = await prisma.student.create({
      data: {
        studentFirstName: body.studentFirstName,
        studentLastName: body.studentLastName,
        studentDateOfBirth: body.studentDateOfBirth,
        userId: body.teacher,
      },
    })
    return res.status(200).json({ success: true, ...newEntry })
  } catch (error) {
    console.error("Request error", error)
    res.status(500).json({ error: "Error adding student", success: false })
  }
}

async function deleteStudent(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  try {
    const student = await prisma.student.delete({
      where: { id: body.student.id },
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
  }
}
