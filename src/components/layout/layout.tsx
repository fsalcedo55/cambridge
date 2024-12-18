import { Fragment, useState } from "react"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { userNavigation } from "@src/constants/navigation"
import Sidebar from "./sidebar"
import MobileSidebar from "./MobileSidebar"
import { FaUserAlt } from "react-icons/fa"

interface Props {
  children: React.ReactNode
}

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

function ProfileDropdown({ userImage }: { userImage: string | JSX.Element }) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          <span className="sr-only">Open user menu</span>
          {typeof userImage === "string" ? (
            <Image
              src={userImage as string}
              alt="user-photo"
              width={40}
              height={40}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="text-xl">
              <FaUserAlt />
            </div>
          )}
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
  )
}

export default function Layout({ children }: Props) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const me = trpc.user.me.useQuery({ email: session?.user?.email! })

  // Tell Knock to use the users id and the token for the user
  // knockClient.authenticate(session?.user?.email!, session?.knockToken)

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
                  <MobileSidebar />
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

            <div className="flex justify-between flex-1 px-8">
              <div className="flex items-center flex-shrink-0 gap-2 px-4">
                <Link href="/" legacyBehavior>
                  <Image
                    src="/Spanish-For-Us-Logo-1080p (2).png"
                    alt="logo"
                    width={118}
                    height={36}
                  />
                </Link>
                <div className="text-sm font-bold">
                  {session?.role === "admin" && "Admin"}
                  {session?.role === "teacher" && "Teacher"}
                  {session?.role === "parent" && "Parent"} Portal
                </div>
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <button
                  type="button"
                  className="p-1 bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                </button>

                {/* ======== Profile dropdown ======== */}
                {session?.user && (
                  <ProfileDropdown
                    userImage={session?.user?.image ?? <FaUserAlt />}
                  />
                )}
              </div>
            </div>
          </div>
          {/* ======== Static sidebar for desktop ======== */}
          <div className="z-50 hidden mt-24 h-max md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            {/* Sidebar component */}
            {<Sidebar />}
          </div>

          <main className="z-0 min-h-screen md:pl-64">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                {/* ======== Start content ======== */}
                <div className="py-4 mt-16">{children}</div>
                {/* ======== /End content ======== */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

// import {
//   KnockFeedProvider,
//   NotificationIconButton,
//   NotificationFeedPopover,
// } from "@knocklabs/react-notification-feed"
// import "@knocklabs/react-notification-feed/dist/index.css"
// import Knock from "@knocklabs/client"

// const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!)

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const session = await getAuthSession(ctx)
//   if (!session || session.role != "teacher") {
//     return { redirect: { destination: "/", permanent: false } }
//   }
//   return {
//     props: {
//       sessionSSR: await getAuthSession(ctx),
//     },
//   }
// }

{
  /* This goes after the span tag that says "View notifications" */
}
{
  /* <BellIcon className="w-6 h-6" aria-hidden="true" /> */
}
{
  /* {session?.user?.email && session?.knockToken.knockToken && (
                    <KnockFeedProvider
                      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
                      feedId="5fe0ad69-0264-4656-b860-9e64a36a5636"
                      userId={session?.user?.email}
                      userToken={session?.knockToken.knockToken}
                    >
                      <>
                        <NotificationIconButton
                          ref={notifButtonRef}
                          onClick={(e) => setIsVisible(!isVisible)}
                        />
                        <NotificationFeedPopover
                          buttonRef={notifButtonRef}
                          isVisible={isVisible}
                          onClose={() => setIsVisible(false)}
                        />
                      </>
                    </KnockFeedProvider>
                  )} */
}
