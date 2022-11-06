import { Dialog, Transition } from "@headlessui/react"

interface Props {
  isOpen: boolean
  setIsOpen: any
  loading?: boolean
  currentData?: any
  actionFunction?: any
  title: string
  description: any
  closeButton: string
  actionButton?: string
  actionButtonStyle?: string
  actionButtonLoading?: string
}

export default function Modal({
  isOpen,
  setIsOpen,
  loading,
  currentData,
  actionFunction,
  title,
  description,
  closeButton,
  actionButton,
  actionButtonStyle,
  actionButtonLoading,
}: Props) {
  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2">
                {description}
              </Dialog.Description>
              <div className="flex flex-col gap-2 mt-1">
                {actionButton && loading ? (
                  <button className="btn btn-error loading btn-disabled">
                    {actionButtonLoading}
                  </button>
                ) : (
                  <button
                    onClick={() => actionFunction(currentData)}
                    className={actionButtonStyle}
                  >
                    {actionButton}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline"
                >
                  {closeButton}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
