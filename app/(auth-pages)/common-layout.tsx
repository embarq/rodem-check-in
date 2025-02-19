import { Slot } from '@radix-ui/react-slot'
import classNames from 'classnames'

interface Props {
  className?: string
  title?: string
  description?: string | React.ReactNode
  asChild?: boolean
  childProps?: React.PropsWithChildren<
    React.RefAttributes<HTMLElement> & React.RefAttributes<HTMLFormElement>
  >
}

export const CommonLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  title,
  description,
  asChild = false,
  childProps,
}) => {
  const DynamicChild = asChild ? Slot : 'form'

  return (
    <section
      className={classNames(
        'flex min-w-72 flex-1 flex-col space-y-6',
        className,
      )}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-foreground">{description}</p>
      <DynamicChild
        className="flex flex-col gap-2 [&>input]:mb-3"
        {...childProps}
      >
        {children}
      </DynamicChild>
    </section>
  )
}
