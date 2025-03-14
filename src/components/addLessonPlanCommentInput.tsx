import { useForm } from "react-hook-form"
import { trpc } from "@src/utils/trpc"
import Image from "next/image"
import Loading from "./ui/loading"
import { toast } from "sonner"
import type { User } from "@src/components/teacher/students/LessonPlans"

export type FormFields = {
  content: string
}

interface LessonPlan {
  id: string
}

interface Props {
  currentLessonPlan: LessonPlan
  user: User
}

export default function AddLessonPlanCommentInput({
  currentLessonPlan,
  user,
}: Props) {
  const addLessonPlanComment = trpc.lessonPlanComment.add.useMutation({
    onMutate: () => {
      reset()
    },
  })

  const { register, handleSubmit, reset } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLessonPlanComment.mutateAsync({
        content: data.content,
        lessonPlanId: currentLessonPlan.id,
        userId: user.id,
      })
    } catch (error) {
      toast.error("Failed to add comment")
      return
    }
    toast.success("Comment added successfully")
  })

  const defaultAvatar = "/landingPageAssets/mascots/Untitled-8.png"

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <Image
              src={user.image || defaultAvatar} // Provide fallback image
              alt="teacher-photo"
              height={40}
              width={40}
            />
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <input
            {...register("content")}
            type="text"
            id="text"
            className="block w-full p-3 border rounded-full border-neutral-100 pl-14 pr-28 text-neutral-700 bg-neutral-50 focus:ring-primary focus:border-primary"
            placeholder="Add a comment..."
            required
          />
          {addLessonPlanComment.isLoading ? (
            <button disabled className="absolute right-2.5 inset-y-2 px-4">
              <Loading size="small" />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-2.5 inset-y-2 px-4 font-bold text-base-content/60 hover:bg-base-300 rounded-full"
            >
              Comment
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
