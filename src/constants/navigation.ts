import { AiFillHome } from "react-icons/ai"
import { BsFillCameraVideoFill } from "react-icons/bs"
import { FaChild, FaGoogleDrive } from "react-icons/fa"
import { HiOutlineCollection, HiTemplate, HiUsers } from "react-icons/hi"
import { IoCalendar } from "react-icons/io5"
import { RiGameFill } from "react-icons/ri"
import { SiGmail } from "react-icons/si"

export const adminNavigation = [
  {
    name: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: AiFillHome,
    current: true,
  },
  { name: "Users", href: "/admin/users", icon: HiUsers, current: false },
  { name: "Students", href: "/admin/students", icon: FaChild, current: false },
  {
    name: "Curriculum",
    href: "/admin/curriculum",
    icon: HiOutlineCollection,
    current: false,
  },
]
export const adminNavigationExternal = [
  {
    name: "Calendar",
    href: "https://calendar.google.com/",
    icon: IoCalendar,
    current: false,
    external: true,
  },
  {
    name: "Google Drive",
    href: "https://drive.google.com/",
    icon: FaGoogleDrive,
    current: false,
    external: true,
  },
  {
    name: "Gmail",
    href: "https://mail.google.com/",
    icon: SiGmail,
    current: false,
    external: true,
  },
  {
    name: "Templates",
    href: "https://drive.google.com/drive/folders/1L7PEmtkf-sqckMCR3Yin03J_RIyrhmB_",
    icon: HiTemplate,
    current: false,
    external: true,
  },
  {
    name: "Games",
    href: "https://sites.google.com/view/spanishforusgames/home",
    icon: RiGameFill,
    current: false,
    external: true,
  },
  {
    name: "Zoom",
    href: "https://zoom.us/signin#/login",
    icon: BsFillCameraVideoFill,
    current: false,
    external: true,
  },
]

export const teacherNavigation = [
  {
    name: "Students",
    href: "/teacher/students",
    icon: FaChild,
    current: false,
  },
]

export const teacherNavigationExternal = [
  {
    name: "Calendar",
    href: "https://calendar.google.com/",
    icon: IoCalendar,
    current: false,
    external: true,
  },
  {
    name: "Google Drive",
    href: "https://drive.google.com/",
    icon: FaGoogleDrive,
    current: false,
    external: true,
  },
  {
    name: "Games",
    href: "https://sites.google.com/view/spanishforusgames/home",
    icon: RiGameFill,
    current: false,
    external: true,
  },
  {
    name: "Zoom",
    href: "https://zoom.us/signin#/login",
    icon: BsFillCameraVideoFill,
    current: false,
    external: true,
  },
]

export const userNavigation = [{ name: "Sign out", href: "/api/auth/signout" }]
