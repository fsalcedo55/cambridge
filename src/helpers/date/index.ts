import dayjs from "dayjs"

// Returns age based on birthdate
export function getAge(birthdate: string, boolean: boolean) {
  const dayjs = require("dayjs")
  const relativeTime = require("dayjs/plugin/relativeTime")
  dayjs.extend(relativeTime)
  return dayjs().from(dayjs(birthdate), boolean)
}
