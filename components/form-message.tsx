import classNames from 'classnames'

export type Message =
  | { success: string }
  | { error: string }
  | { message: string }

interface Props {
  title?: string
  message?: Message | null
  className?: string
}

export function FormMessage({ title, message, className }: Props) {
  if (!message) return null

  return (
    <div
      className={classNames(
        'relative flex flex-col w-full max-w-md mt-3 p-2 border-l-4 text-foreground',
        {
          'border-green-400': 'success' in message,
          'border-destructive': 'error' in message,
        },
        className,
      )}
    >
      <div
        className={classNames(
          'absolute inset-0 -z-10 bg-gradient-to-r via-transparent to-transparent opacity-10',
          {
            'from-green-500': 'success' in message,
            'from-destructive': 'error' in message,
          },
        )}
      ></div>
      <strong
        className={classNames('text-base font-bold', {
          'text-green-500': 'success' in message,
          'text-destructive': 'error' in message,
        })}
      >
        {title}
      </strong>
      {'success' in message && <p>{message.success}</p>}
      {'error' in message && <p>{message.error}</p>}
      {'message' in message && <p>{message.message}</p>}
    </div>
  )
}

