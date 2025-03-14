import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"

export const onboardingSchema = z.object({
  parentName: z.string().min(1, "Please tell us your name!"),
  childFirstName: z.string().min(1, "What's your child's first name?"),
  childLastName: z.string().min(1, "What's your child's last name?"),
  childDateOfBirth: z.string().min(1, "When was your child born?"),
  childGender: z.string().min(1, "Please select your child's gender"),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

interface Props {
  onComplete: (values: OnboardingFormValues) => Promise<void>
}

const CloudShape = () => (
  <svg
    viewBox="0 0 1440 320"
    className="absolute bottom-0 w-full drop-shadow-2xl"
    preserveAspectRatio="none"
    height="180"
  >
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="-4" stdDeviation="8" floodOpacity="0.15" />
      </filter>
    </defs>
    <path
      fill="white"
      fillOpacity="0.9"
      filter="url(#shadow)"
      d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,165.3C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
)

export default function ParentOnboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      parentName: "",
      childFirstName: "",
      childLastName: "",
      childDateOfBirth: "",
      childGender: "",
    },
  })

  const onSubmit = async (data: OnboardingFormValues) => {
    await onComplete(data)
  }

  const validateStep = async () => {
    switch (step) {
      case 1:
        return await trigger("parentName")
      case 2:
        return await trigger(["childFirstName", "childLastName"])
      case 3:
        return await trigger("childDateOfBirth")
      case 4:
        return await trigger("childGender")
      default:
        return false
    }
  }

  const nextStep = async () => {
    const isValid = await validateStep()
    if (isValid) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const progressWidth = `${(step / totalSteps) * 100}%`

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-600 via-primary-400 to-primary-50">
      <div className="sticky top-0 z-10 w-full p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="w-full h-4 rounded-full bg-white/20 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full bg-gradient-to-br from-yellow-500 via-yellow-100 to-yellow-200"
              initial={{ width: 0 }}
              animate={{ width: progressWidth }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-white shadow-2xl rounded-2xl backdrop-blur-sm"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary-600">
                      Welcome to our learning adventure! 🌟
                    </h2>
                    <div>
                      <label className="block mb-2 text-lg text-gray-700">
                        What&apos;s your name?
                      </label>
                      <input
                        {...register("parentName")}
                        type="text"
                        className="w-full px-4 py-3 transition-all border-2 shadow-sm rounded-xl border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Enter your name"
                      />
                      {errors.parentName && (
                        <div className="mt-2 text-red-500">
                          {errors.parentName.message}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary-600">
                      Let&apos;s meet your little star! ⭐
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-lg text-gray-700">
                          Child&apos;s First Name
                        </label>
                        <input
                          type="text"
                          {...register("childFirstName")}
                          className="w-full px-4 py-3 border-2 rounded-xl border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        />
                        {errors.childFirstName && (
                          <div className="mt-2 text-red-500">
                            {errors.childFirstName.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-lg text-gray-700">
                          Child&apos;s Last Name
                        </label>
                        <input
                          type="text"
                          {...register("childLastName")}
                          className="w-full px-4 py-3 border-2 rounded-xl border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        />
                        {errors.childLastName && (
                          <div className="mt-2 text-red-500">
                            {errors.childLastName.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary-600">
                      When did the joy begin? 🎈
                    </h2>
                    <div>
                      <label className="block mb-2 text-lg text-gray-700">
                        Child&apos;s Birthday
                      </label>
                      <input
                        type="date"
                        {...register("childDateOfBirth")}
                        className="w-full px-4 py-3 border-2 rounded-xl border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                      {errors.childDateOfBirth && (
                        <div className="mt-2 text-red-500">
                          {errors.childDateOfBirth.message}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary-600">
                      One last thing! 🌈
                    </h2>
                    <div>
                      <label className="block mb-2 text-lg text-gray-700">
                        Child&apos;s Gender
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {["Boy", "Girl"].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() =>
                              setValue("childGender", gender, {
                                shouldValidate: true,
                              })
                            }
                            className={`p-4 rounded-xl border-2 transition-all ${
                              watch("childGender") === gender
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200 hover:border-primary-300"
                            }`}
                          >
                            <span className="mb-2 text-xl">
                              {gender === "Boy" ? "👦" : "👧"}
                            </span>
                            <p className="font-medium">{gender}</p>
                          </button>
                        ))}
                      </div>
                      {errors.childGender && (
                        <div className="mt-2 text-red-500">
                          {errors.childGender.message}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 transition-colors bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}
                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 ml-auto text-white transition-colors rounded-lg shadow-sm bg-primary-500 hover:bg-primary-600"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 ml-auto text-white transition-colors rounded-lg shadow-sm bg-primary-500 hover:bg-primary-600"
                    >
                      Complete! 🎉
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>

      <div className="relative w-full h-44">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.6,
          }}
          className="relative w-full h-full"
        >
          <CloudShape />
          <div className="absolute bottom-0 w-full h-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="flex items-center justify-end w-full h-full pr-6"
            >
              <Image
                src="/Spanish-For-Us-Logo-1080p (2).png"
                alt="Spanish for Us"
                width={120}
                height={40}
                className="relative z-10 drop-shadow-md"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
