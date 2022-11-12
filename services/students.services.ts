import axios from "axios"

export const getAllStudents = async () => {
  const { data } = await axios.get("/api/students")
  return data.allStudents
}
