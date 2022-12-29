import { Knock } from "@knocklabs/node"
import type { NextApiRequest, NextApiResponse } from "next"

const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY)

const KNOCK_WORKFLOW = "new-lesson-plan"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .setHeader("Allow", "POST")
      .json({ error: `${req.method} method is not accepted.` })
  }

  const { recipientId, actorId, studentName, lessonName, actionUrl } = req.body

  try {
    await knockClient.workflows.trigger(KNOCK_WORKFLOW, {
      recipients: [recipientId],
      actor: actorId,
      data: {
        studentName,
        lessonName,
        actionUrl,
      },
    })

    return res.status(200).json({ error: null })
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || error.toString(), user: null })
    }
  }
}
