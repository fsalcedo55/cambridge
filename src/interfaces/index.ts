export interface IUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string | null
}

export interface IStudent {
  id: string
  userId: string | null
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  status: string
  teacher?: {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    role: string | null
  } | null
  entitlements: Array<{
    id: string
    Level?: {
      id: string
      number: number
      title: string
    } | null
  }>
  lessonPlans: Array<{
    id: string
  }>
}

export interface ILessonPlan {
  id: string
  title: string
  date: string
  slidesUrl: string | null
  homeworkSent: boolean | null
  comments: {
    id: string
    content: string
    createdAt: Date
    User: {
      id: string
      name: string | null
      email?: string | null
      emailVerified?: Date | null
      image: string | null
      role?: string | null
    }
  }[]
}

export interface ILessonPlanComment {
  id: string
  User: IUser
  content: string
  createdAt: Date
}
