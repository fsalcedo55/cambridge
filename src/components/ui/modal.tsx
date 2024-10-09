import { Dialog, Transition } from "@headlessui/react"
import { ButtonLegacy } from "@ui/buttonLegacy"

interface Props {
  isOpen: boolean
  setIsOpen: any
  loading?: boolean
  currentData?: any
  actionFunction?: any
  title: any
  description: any
  closeButton: string
  actionButton?: string
  actionButtonStyle?: string
  actionButtonLoading?: string
  loadingLabel?: string
  btnIntent?: "primary" | "secondary" | "danger" | "cancel" | undefined
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
  loadingLabel,
  btnIntent,
}: Props) {
  return (
    <>
      <Transition
        appear
        show={isOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-550"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md max-h-full p-4 overflow-auto text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-bold leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-4" as="div">
                {description}
              </Dialog.Description>
              <div className="flex flex-col gap-2">
                {actionButton && (
                  <ButtonLegacy
                    onClick={() => actionFunction(currentData)}
                    loading={loading}
                    loadingLabel={loadingLabel}
                    size="medium"
                    intent={btnIntent}
                  >
                    {actionButton}
                  </ButtonLegacy>
                )}
                <ButtonLegacy
                  onClick={() => setIsOpen(false)}
                  intent="cancel"
                  size="medium"
                >
                  {closeButton}
                </ButtonLegacy>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
