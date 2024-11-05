// Returns age based on birthdate
export function getAge(birthdate: string) {
  if (birthdate) {
    const birthDateObj = new Date(birthdate)
    const currentDate = new Date()

    const yearsDiff =
      currentDate.getUTCFullYear() - birthDateObj.getUTCFullYear()
    const monthsDiff = currentDate.getUTCMonth() - birthDateObj.getUTCMonth()
    const daysDiff = currentDate.getUTCDate() - birthDateObj.getUTCDate()

    const calculatedAge = { years: yearsDiff, months: monthsDiff }
    if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
      calculatedAge.years--
      calculatedAge.months += 12
    }

    if (calculatedAge.months === 1)
      return `${calculatedAge.years} years, ${calculatedAge.months} month`

    return `${calculatedAge.years} years, ${calculatedAge.months} months`
  }
}
