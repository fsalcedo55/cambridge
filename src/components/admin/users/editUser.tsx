import { Button } from "@ui/button"
import { Switch } from "@headlessui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { useSession } from "next-auth/react"
import { IUser } from "@src/interfaces"
import { capFirstLetter } from "@src/helpers/string"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  id: string
  role: string
}

interface Props {
  user: IUser | undefined
  closeModal: () => void
}

export default function EditUser({ user, closeModal }: Props) {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const editUser = trpc.user.editUser.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editUser.mutateAsync({
        id: user?.id!,
        role: data.role,
      })
    } catch (error) {
      console.log(error)
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

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Saving..."
        loading={editUser.isLoading}
        fullWidth
      >
        Save
      </Button>
    </form>
  )
}
