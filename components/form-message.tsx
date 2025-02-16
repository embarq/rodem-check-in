import classNames from 'classnames'

export type Message =
  | { success: string }
  | { error: string }
  | { message: string }

interface Props {
  message?: Message | null
  className?: string
}

export function FormMessage({ message, className }: Props) {
  if (!message) return null

  return (
    <div
      className={classNames(
        'flex w-full max-w-md gap-2 mt-3 flex-col text-sm',
        className,
      )}
    >
      {'success' in message && (
        <div className="border-l-4 border-green-400 px-2 text-foreground">
          {message.success}
        </div>
      )}
      {'error' in message && (
        <div className="border-l-4 border-destructive px-2 text-destructive">
          {message.error}
        </div>
      )}
      {'message' in message && (
        <div className="border-l-4 px-2 text-foreground">{message.message}</div>
      )}
    </div>
  )
}

