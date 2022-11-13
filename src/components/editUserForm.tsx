import { Formik, Field, Form, FormikHelpers } from "formik"
import { useState } from "react"
import Loading from "./ui/loading"

interface Values {
  role: string
  user: any
}

interface Props {
  user: any
}

export default function EditUserForm({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [defaultValueState, setDefaultValueState] = useState("default")

  console.log({ user })

  return (
    <div>
      <div>
        <h1>Name</h1>
        <input
          type="text"
          className="w-full max-w-xs mb-2 input input-bordered"
          disabled
          placeholder={user?.name}
        />
        <Formik
          initialValues={{
            role: "",
            user,
          }}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            setTimeout(() => {
              const handleSubmit = async () => {
                setIsLoading(true)

                const body = { ...values }
                console.log("body: ", body)
                try {
                  const response = await fetch("/api/users", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  })
                  if (response.status !== 200) {
                    console.log("something went wrong")
                    //set an error banner here
                  } else {
                    console.log("form submitted successfully !!!")
                    //set a success banner here
                  }
                  //check response, if success is false, dont take them to success page
                } catch (error) {
                  console.log("there was an error submitting", error)
                }
                setIsLoading(false)
              }
              handleSubmit()
              setSubmitting(false)
            }, 500)
          }}
        >
          <Form className="flex flex-col">
            <label htmlFor="role" className="my-2">
              Role
            </label>
            <Field
              name="role"
              as="select"
              className="w-full max-w-xs select select-bordered"
              defaultValue={defaultValueState}
            >
              <option value={defaultValueState}>Assign a Role</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </Field>
            {isLoading ? (
              <button className="max-w-xs my-4 btn loading">Processing</button>
            ) : (
              <button type="submit" className="max-w-xs my-4 btn">
                Submit
              </button>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  )
}
