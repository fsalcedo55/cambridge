import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddStudent from "./addStudent"

// Mock the trpc hook
vi.mock("@src/utils/trpc", () => ({
  trpc: {
    level: {
      getLevelsReduced: {
        useQuery: () => ({
          data: [
            { id: "1", number: 1, title: "Beginner" },
            { id: "2", number: 2, title: "Intermediate" },
          ],
        }),
      },
    },
  },
}))

describe("AddStudent", () => {
  const mockHandleSubmit = vi.fn()
  const mockTeachers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ]

  const defaultProps = {
    teachers: mockTeachers,
    handleSubmit: mockHandleSubmit,
    btnLoading: false,
    btnLabel: "Adding student...",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the form with all required fields", () => {
    render(<AddStudent {...defaultProps} />)

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assign a teacher/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByText(/assign levels/i)).toBeInTheDocument()
  })

  it("displays validation errors when submitting empty form", async () => {
    render(<AddStudent {...defaultProps} />)

    const submitButton = screen.getByRole("button", { name: /add student/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errors = screen.getAllByText(/required/i)
      expect(errors.length).toBeGreaterThan(0)
    })

    expect(mockHandleSubmit).not.toHaveBeenCalled()
  })

  it("submits form with valid data", async () => {
    render(<AddStudent {...defaultProps} />)

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/first name/i), "John")
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe")
    await userEvent.type(screen.getByLabelText(/date of birth/i), "2000-01-01")

    // Select teacher
    const teacherSelect = screen.getByLabelText(/assign a teacher/i)
    await userEvent.selectOptions(teacherSelect, "1")

    // Select status
    const statusSelect = screen.getByLabelText(/status/i)
    await userEvent.selectOptions(statusSelect, "Active")

    // Select a level
    const levelCheckbox = screen.getByLabelText(/level 1/i)
    await userEvent.click(levelCheckbox)

    // Submit form
    const submitButton = screen.getByRole("button", { name: /add student/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        studentFirstName: "John",
        studentLastName: "Doe",
        studentDateOfBirth: "2000-01-01",
        teacher: "1",
        status: "Active",
        levelId: ["1"],
      })
    })
  })

  it("shows loading state when submitting", () => {
    render(<AddStudent {...defaultProps} btnLoading={true} />)

    const submitButton = screen.getByRole("button")
    expect(submitButton).toHaveTextContent("Adding student...")
  })
})
