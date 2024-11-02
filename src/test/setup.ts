import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock React if needed
vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    default: actual,
  }
})
