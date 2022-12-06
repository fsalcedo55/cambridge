export interface Student {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  userId: string
  id: string
  status: string
  teacher: {
    id: string
    name: string
    email: string
    emailVerified: null
    image: string
    role: string
  }
}
