import Image from 'next/image'
import { Slot } from '@radix-ui/react-slot'
import classNames from 'classnames'
import Logo from '@/assets/logo-lg.PNG'

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
    <section className={classNames('flex min-w-72 flex-1 flex-col', className)}>
      <Image
        src={Logo}
        alt="Logo"
        width={140}
        height={140}
        className="-translate-x-6"
      />
      <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
      <p className="mt-6 text-sm text-foreground">{description}</p>
      <DynamicChild
        className="mt-6 flex flex-col gap-2 [&>input]:mb-3"
        {...childProps}
      >
        {children}
      </DynamicChild>
    </section>
  )
}

