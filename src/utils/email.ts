import { Resend } from "resend"
import { logger } from "../utils/logger"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface LessonPlanEmailParams {
  teacherName: string
  lessonPlanTitle: string
  lessonPlanDescription?: string
  lessonPlanId: string
  studentId: string
  studentName: string
  lessonDate: string
  slidesUrl?: string | null
}

/**
 * Sends a notification email to admin when a new lesson plan is created
 * @param params - Parameters for the email content
 * @returns Object containing success status and message or error
 */
export async function sendLessonPlanNotificationEmail(
  params: LessonPlanEmailParams
) {
  const {
    teacherName,
    lessonPlanTitle,
    lessonPlanDescription = "",
    lessonPlanId,
    studentId,
    studentName,
    lessonDate,
    slidesUrl,
  } = params

  const appUrl = process.env.NEXTAUTH_URL || "https://spanishforuskids.com"
  const lessonPlanUrl = `${appUrl}/admin/students/${studentId}`

  try {
    const { data, error } = await resend.emails.send({
      from: "Spanish For Us <onboarding@resend.dev>",
      to: "fsalcedo55@hotmail.com",
      subject: `📝 New Lesson Plan: ${teacherName} → ${studentName}`,
      html: `
        <div style="font-family: 'Helvetica', 'Arial', 'Nimbus Sans L', 'Liberation Sans', sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto; color: #333; background-color: #ffffff; padding: 30px;">
          <div style="border-left: 4px solid #007ee6; padding-left: 15px; margin-bottom: 25px;">
            <h2 style="color: #007ee6; font-weight: 900; margin: 0;">New Lesson Plan</h2>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">From ${teacherName} for ${studentName}</p>
          </div>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <div style="font-size: 16px; line-height: 1.6;">
              <p><span style="color: #666; display: inline-block; width: 120px;">Teacher:</span> <strong>${teacherName}</strong></p>
              <p><span style="color: #666; display: inline-block; width: 120px;">Student:</span> <strong>${studentName}</strong></p>
              <p><span style="color: #666; display: inline-block; width: 120px;">Lesson Title:</span> <strong>${lessonPlanTitle}</strong></p>
              <p><span style="color: #666; display: inline-block; width: 120px;">Lesson Date:</span> <strong>${new Date(
                lessonDate
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</strong></p>
              ${
                lessonPlanDescription
                  ? `<p><span style="color: #666; display: inline-block; width: 120px;">Description:</span> <strong>${lessonPlanDescription}</strong></p>`
                  : ""
              }
              ${
                slidesUrl
                  ? `<p style="margin-top: 16px;"><span style="color: #666; display: inline-block; width: 120px;">Slides:</span> <a href="${slidesUrl}" target="_blank" style="background-color: #f5f5f5; color: #007ee6; border: 1px solid #ddd; padding: 5px 12px; text-decoration: none; border-radius: 50px; display: inline-block; font-size: 13px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 5px;"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>View Slides</a></p>`
                  : ""
              }
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${lessonPlanUrl}" style="background-color: #007ee6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 500; font-size: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              View Lesson Plan
            </a>

          </div>
          
          <hr style="border: none; height: 1px; background-color: #eaeaea; margin: 30px 0 20px;">
          
          <div style="display: flex; align-items: center;">
            <img src="https://spanishforuskids.com/Spanish-For-Us-Logo-1080p%20(2).png" alt="Spanish For Us Logo" style="width: 140px; max-width: 100%; height: auto; display: block;">
            <p style="color: #999; font-size: 10px; margin-top: 0; margin-left: 15px;">
              This is an automated notification from Spanish For Us.<br>Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      logger.error("Failed to send lesson plan notification email", {
        error,
        lessonPlanId,
      })
      return { success: false, error }
    }

    logger.info("Lesson plan notification email sent successfully", {
      messageId: data?.id,
      lessonPlanId,
      teacherName,
    })

    return { success: true, messageId: data?.id }
  } catch (error) {
    logger.error(
      "Exception occurred while sending lesson plan notification email",
      {
        error,
        lessonPlanId,
      }
    )
    return { success: false, error }
  }
}
