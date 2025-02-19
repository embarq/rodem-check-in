import classNames from 'classnames'
import { LocaleSwitcher } from './locale-switcher'
import { ThemeSwitcher } from './theme-switcher'

interface Props {
  className?: string
}

export function Footer({ className }: Props) {
  return (
    <footer
      className={classNames(
        'mx-auto flex min-h-[4.3125rem] w-full items-center justify-between gap-8 border-t px-5 py-4 text-center text-xs',
        className,
      )}
    >
      <ThemeSwitcher />
      <LocaleSwitcher />
    </footer>
  )
}

