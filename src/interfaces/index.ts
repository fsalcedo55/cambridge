export interface IUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string | null
}

export interface IStudent {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  userId: string
  id: string
  status: string
  entitlements: any
  teacher: {
    id: string
    name: string
    email: string
    emailVerified: null
    image: string
    role: string
  }
}

export interface ILessonPlan {
  id?: string
  date: string
  title: string
  slidesUrl: string | null
  homeworkSent: boolean | null
}

export interface ILessonPlanComment {
  id: string
  User: IUser
  content: string
  createdAt: Date
}
