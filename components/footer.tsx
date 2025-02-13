import classNames from 'classnames'
import { ThemeSwitcher } from './theme-switcher'
import LocaleSwitcher from './locale-switcher'

interface Props {
  className?: string
}

export default function Footer({ className }: Props) {
  return (
    <footer
      className={classNames(
        'mx-auto flex w-full items-center justify-between gap-8 border-t px-5 py-4 text-center text-xs',
        className,
      )}
    >
      <ThemeSwitcher />
      <LocaleSwitcher />
    </footer>
  )
}

