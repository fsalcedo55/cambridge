import { signIn, signOut, useSession } from "next-auth/react"
import Loading from "../ui/loading"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <div className="flex justify-between h-16 pr-16 shadow max-w-screen navbar bg-base-100">
      <div className="flex justify-center w-64 gap-2">
        <Link href="/" legacyBehavior>
          <Image
            src="/Spanish-For-Us-Logo-1080p (2).png"
            alt="logo"
            width={118}
            height={36}
          />
        </Link>
        {session ? (
          session?.role === "admin" ? (
            <div className="text-sm font-bold">Admin Portal</div>
          ) : (
            <div className="text-sm font-bold">Teacher Portal</div>
          )
        ) : (
          ""
        )}
      </div>
      <div>
        {!session && loading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div>
            <div>
              {!session && (
                <>
                  <a
                    href={`/api/auth/signin`}
                    onClick={(e) => {
                      e.preventDefault()
                      signIn()
                    }}
                    className="btn"
                  >
                    Sign in
                  </a>
                </>
              )}
            </div>
            {session?.user && (
              <div className="flex items-center">
                <span>
                  {session.user.name && (
                    <p className="mx-2">Hello, {session.user.name}!</p>
                  )}
                </span>
                <div className="dropdown dropdown-end">
                  {session.user.image && (
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        <Image
                          src={session?.user?.image}
                          alt="user-photo"
                          width={40}
                          height={40}
                        />
                      </div>
                    </label>
                  )}
                  <ul
                    tabIndex={0}
                    className="p-2 mt-3 bg-white shadow menu menu-compact dropdown-content rounded-box w-52"
                  >
                    {session?.role === "admin" ? (
                      <li>
                        <Link href={`/admin/dashboard`} legacyBehavior>
                          <p>Dashboard</p>
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link href={`/teacher/students`} legacyBehavior>
                          <p>Students</p>
                        </Link>
                      </li>
                    )}
                    <li>
                      <a
                        href={`/api/auth/signout`}
                        onClick={(e) => {
                          e.preventDefault()
                          signOut({ callbackUrl: process.env.NEXTAUTH_URL })
                        }}
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
