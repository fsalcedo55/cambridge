import { ButtonLegacy } from "@ui/buttonLegacy"
// import { Switch } from "@headlessui/react"
import { useForm } from "react-hook-form"
// import { FormInput } from "@ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { type IUser } from "@src/interfaces"
import { capFirstLetter } from "@src/helpers/string"
import { toast } from "sonner"

export type FormFields = {
  id: string
  role: string
}

interface Props {
  user: IUser | undefined
  closeModal: () => void
}

export default function EditUser({ user, closeModal }: Props) {
  const { register, handleSubmit } = useForm<FormFields>()
  const editUser = trpc.user.editUser.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editUser.mutateAsync({
        id: user?.id ?? "",
        role: data.role,
      })
      toast.success("User updated successfully")
    } catch (error) {
      toast.error("Error updating user")
    }
    closeModal()
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Role</span>
        </label>
        <select className="w-full select select-bordered" {...register("role")}>
          <option
            disabled
            selected
            value={user?.role ? capFirstLetter(user?.role) : "Select a Role"}
          >
            {user?.role ? capFirstLetter(user?.role) : "Select a Role"}
          </option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Saving..."
        loading={editUser.isLoading}
        fullWidth
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
