import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { Button } from "./ui/button"
import { trpc } from "@src/utils/trpc"

export type FormFields = {
  content: string
}

interface Props {
  currentLessonPlan: any
  closeModal: () => void
}

export default function AddLessonPlanCommentInput({
  currentLessonPlan,
  closeModal,
}: Props) {
  const addLessonPlanComment = trpc.lessonPlanComment.add.useMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLessonPlanComment.mutateAsync({
        content: data.content,
        lessonPlanId: currentLessonPlan.id,
        //TODO: need to figure out how to get global user state to use current user ID
        userId: currentLessonPlan.id,
      })
    } catch (error) {}
    closeModal()
  })

  console.log("ref currentlessonplan: ", currentLessonPlan)

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2 form-control">
        <textarea
          {...register("content")}
          className="h-24 textarea textarea-bordered"
          placeholder="Add a comment..."
        ></textarea>
        {/* <label className="label">
          <span className="label-text-alt">Errors go here</span>
        </label> */}
      </div>

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={addLessonPlanComment.isLoading}
        loadingLabel="Posting Comment..."
        fullWidth
      >
        Post
      </Button>
    </form>
  )
}
