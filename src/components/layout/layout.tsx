import { Fragment, useState } from "react"
import { Dialog, Menu, Transition } from "@headlessui/react"
import {
  Bars3BottomLeftIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { AiFillHome } from "react-icons/ai"
import { HiUsers } from "react-icons/hi"
import { FaChild } from "react-icons/fa"
import { useRouter } from "next/router"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Footer from "./footer"
import Link from "next/link"

interface Props {
  children: React.ReactNode
}

const adminNavigation = [
  {
    name: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: AiFillHome,
    current: true,
  },
  { name: "Users", href: "/admin/users", icon: HiUsers, current: false },
  { name: "Students", href: "/admin/students", icon: FaChild, current: false },
]
const teacherNavigation = [
  {
    name: "Students",
    href: "/teacher/students",
    icon: FaChild,
    current: false,
  },
]
const userNavigation = [{ name: "Sign out", href: "/api/auth/signout" }]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Example({ children }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="relative">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-opacity-75 bg-neutral-600" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-primary-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex-1 h-0 mt-5 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                      {session?.role === "admin" &&
                        adminNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-primary-800 text-white"
                                : "text-primary-100 hover:bg-primary-600",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className="flex-shrink-0 w-6 h-6 mr-4 text-primary-300"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      {session?.role === "teacher" &&
                        teacherNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-primary-800 text-white"
                                : "text-primary-100 hover:bg-primary-600",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className="flex-shrink-0 w-6 h-6 mr-4 text-primary-300"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* ======== Dummy element to force sidebar to shrink to fit close icon ======== */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="flex flex-col flex-1">
          {/* ======== Navbar ======== */}
          <div className="fixed top-0 z-10 flex flex-shrink-0 w-screen h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r text-neutral-500 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
            </button>

            <div className="flex justify-between flex-1 px-4">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/">
                  <Image
                    src="/Spanish-For-Us-Logo-1080p (2).png"
                    alt="logo"
                    width={118}
                    height={36}
                  />
                </Link>
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <button
                  type="button"
                  className="p-1 bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                {/* ======== Profile dropdown ======== */}
                {session?.user?.image && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          src={session?.user?.image}
                          alt="user-photo"
                          width={40}
                          height={40}
                          className="w-8 h-8 rounded-full"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault()
                                  signOut({
                                    callbackUrl: process.env.NEXTAUTH_URL,
                                  })
                                }}
                                className={classNames(
                                  active ? "bg-neutral-100" : "",
                                  "block px-4 py-2 text-sm text-neutral-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>
          {/* ======== Static sidebar for desktop ======== */}
          <div className="z-50 hidden mt-24 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col ml-8 bg-white shadow rounded-xl">
              <div className="flex flex-col flex-1 mt-5">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {session?.role === "admin" &&
                    adminNavigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={classNames(
                            router.pathname.includes(item.href)
                              ? "bg-primary-600 text-primary-50"
                              : "text-primary-600 hover:bg-neutral-100 hover:text-primary-700",
                            "group flex items-center px-2 py-2 text-md font-bold rounded-md cursor-pointer"
                          )}
                        >
                          <item.icon
                            className="mr-3 text-2xl"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  {session?.role === "teacher" &&
                    teacherNavigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={classNames(
                            router.pathname.includes(item.href)
                              ? "bg-primary-800 text-primary-50"
                              : "text-primary-900 hover:bg-primary-600 hover:text-primary-100",
                            "group flex items-center px-2 py-2 text-md font-bold rounded-md cursor-pointer"
                          )}
                        >
                          <item.icon
                            className="mr-3 text-2xl"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
          </div>

          <main className="z-0 min-h-screen md:pl-64">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                {/* ======== Replace with your content ======== */}
                <div className="py-4 mt-16">
                  {children}
                  {/* <div className="border-4 border-dashed rounded-lg border-neutral-200 h-96" /> */}
                </div>
                {/* ======== /End replace ======== */}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
