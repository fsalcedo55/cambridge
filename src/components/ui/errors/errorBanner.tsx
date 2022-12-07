import { AiOutlineClose } from "react-icons/ai"
import { BsFillMegaphoneFill } from "react-icons/bs"

export default function ErrorBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg shadow-lg bg-danger-600 sm:p-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-1 w-0">
              <span className="flex p-2 rounded-lg bg-danger-800">
                <BsFillMegaphoneFill
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">We announced a new product!</span>
                <span className="hidden md:inline">
                  Big news! We are excited to announce a brand new product.
                </span>
              </p>
            </div>
            <div className="flex-shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href="#"
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border border-transparent rounded-md shadow-sm text-danger-600 hover:bg-danger-50"
              >
                Learn more
              </a>
            </div>
            <div className="flex-shrink-0 order-2 sm:order-3 sm:ml-2">
              <button
                type="button"
                className="flex p-2 -mr-1 rounded-md hover:bg-danger-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Dismiss</span>
                <AiOutlineClose
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
