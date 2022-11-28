import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { Button } from "./ui/button"
import { trpc } from "@src/utils/trpc"
import Image from "next/image"
import Loading from "./ui/loading"

export type FormFields = {
  content: string
}

interface Props {
  currentLessonPlan: any
  // closeModal: () => void
  user: any
}

export default function AddLessonPlanCommentInput({
  currentLessonPlan,
  // closeModal,
  user,
}: Props) {
  const addLessonPlanComment = trpc.lessonPlanComment.add.useMutation({
    onMutate: () => {
      console.log("Comment added")
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLessonPlanComment.mutateAsync({
        content: data.content,
        lessonPlanId: currentLessonPlan.id,
        userId: user.id,
      })
    } catch (error) {}
    // closeModal()
  })

  return (
    <div>
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user.image}
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
                className="block w-full p-3 border rounded-full pl-14 pr-28 text-base-content border-base-300 bg-base-100 focus:ring-primary focus:border-primary"
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
      </div>
      {/* <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between w-full gap-4 p-1 border rounded-full input input-bordered">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user.image}
                  alt="teacher-photo"
                  height={40}
                  width={40}
                />
              </div>
            </div>
            <div>
              <input
                {...register("content")}
                // className="h-12"
                placeholder="Add a comment..."
                className="h-11 border-0 w-[32rem]"
              ></input>
              <label className="label">
              <span className="label-text-alt">Errors go here</span>
            </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-2 font-bold link link-primary link-hover"
          >
            Comment
          </button>
        </div>
      </form> */}
    </div>
  )
}
