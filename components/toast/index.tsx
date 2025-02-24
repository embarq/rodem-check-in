import { ReactNode } from 'react'
import { Close, Description, Root, Title } from '@radix-ui/react-toast'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './toast.module.css'

interface Props {
  title?: ReactNode | string
  description?: ReactNode | string
  isOpen?: boolean
  closable?: boolean
  onChange?: (open: boolean) => void
  className?: string
}

export const Toast: React.FC<Props> = ({
  title,
  description,
  isOpen,
  onChange,
  closable = true,
  className,
}) => {
  return (
    <Root
      className={cn(styles.ToastRoot, className)}
      open={isOpen}
      onOpenChange={onChange}
    >
      {title && <Title>{title}</Title>}
      {closable && (
        <Close asChild>
          <button
            type="button"
            onClick={() => onChange && onChange(false)}
            className="dark:text-card"
          >
            <XIcon />
          </button>
        </Close>
      )}
      {description && (
        <Description
          asChild={typeof description !== 'string'}
          className="text-sm dark:text-card"
        >
          {description}
        </Description>
      )}
    </Root>
  )
}

