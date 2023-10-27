import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3500}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
            <Toast className='flex justify-center text-brand-800 dark:text-brand-200' key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                    <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
