import React from "react"
import { render, screen } from "@testing-library/react"
import StudentPageHeader from "../StudentPageHeader"
import { useRouter } from "next/router"
import { describe, it, expect, beforeEach, vi, type MockInstance } from "vitest"

// Mock Next.js router
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}))

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt || ""} {...props} />
  },
}))

describe("StudentPageHeader", () => {
  const mockRouter = {
    isReady: true,
  }

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(useRouter as unknown as MockInstance).mockReturnValue(mockRouter)
  })

  const defaultProps = {
    isLoading: false,
    studentData: {
      studentFirstName: "John",
      studentLastName: "Doe",
      teacher: {
        image: "https://example.com/teacher.jpg",
        name: "Jane Smith",
      },
    },
    pages: [
      { name: "Students", href: "/students", current: false },
      { name: "John Doe", current: true },
    ],
  }

  it("renders loading skeleton when isLoading is true", () => {
    render(<StudentPageHeader {...defaultProps} isLoading={true} />)

    const loadingSkeletons = screen.getAllByRole("status")
    expect(loadingSkeletons).toHaveLength(3) // Since there are 3 loading skeletons in the component
  })

  it("renders student name and teacher information when not loading", () => {
    render(<StudentPageHeader {...defaultProps} />)

    expect(
      screen.getByRole("heading", { name: "John Doe" })
    ).toBeInTheDocument()
    expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    expect(screen.getByAltText("teacher")).toBeInTheDocument()
  })

  it("renders breadcrumbs correctly", () => {
    render(<StudentPageHeader {...defaultProps} />)

    expect(screen.getByText("Students")).toBeInTheDocument()
    expect(
      screen.getByText("John Doe", { selector: '[aria-current="page"]' })
    ).toBeInTheDocument()
  })

  it("handles missing teacher data gracefully", () => {
    const propsWithoutTeacher = {
      ...defaultProps,
      studentData: {
        studentFirstName: "John",
        studentLastName: "Doe",
      },
    }

    render(<StudentPageHeader {...propsWithoutTeacher} />)

    expect(
      screen.getByRole("heading", { name: "John Doe" })
    ).toBeInTheDocument()
    expect(screen.queryByAltText("teacher")).not.toBeInTheDocument()
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
  })

  it("handles router not being ready", () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(useRouter as unknown as MockInstance).mockReturnValue({ isReady: false })

    render(<StudentPageHeader {...defaultProps} />)

    expect(
      screen.getByRole("heading", { name: "John Doe" })
    ).toBeInTheDocument()
    expect(screen.queryByAltText("teacher")).not.toBeInTheDocument()
  })
})
