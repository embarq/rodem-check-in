import { Provider, Viewport } from '@radix-ui/react-toast'
import styles from './toast.module.css'

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Provider swipeDirection="right">
      {children}
      <Viewport className={styles.ToastViewport} />
    </Provider>
  )
}

