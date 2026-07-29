import { Toast, ToastContent, Text, Button } from '@salt-ds/core'
import { CloseIcon } from '@salt-ds/icons'

interface ToastNotificationProps {
  message: string
  status: 'success' | 'error'
  onDismiss: () => void
}

export function ToastNotification({ message, status, onDismiss }: ToastNotificationProps) {
  return (
    <div className="toast-notification" role="status">
      <Toast status={status}>
        <ToastContent>
          <Text>{message}</Text>
        </ToastContent>
        <Button appearance="transparent" aria-label="Dismiss notification" onClick={onDismiss}>
          <CloseIcon aria-hidden />
        </Button>
      </Toast>
    </div>
  )
}
