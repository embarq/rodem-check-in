'use client'

import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { checkInAction } from '@/app/member/check-in/actions'
import { SubmitButton } from '@/components/submit-button'
import { useGeolocation } from '@/lib/geolocation'

interface Props {
  className?: string
}

export const CheckInForm: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const t = useTranslations('CheckIn')
  const { requestLocation } = useGeolocation()

  const handleSubmit = async () => {
    try {
      const result = await requestLocation()

      if (result == null) {
        throw new Error('message_error_unknown')
      }

      await checkInAction(result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      className={classNames('flex flex-col justify-end', className)}
      onSubmit={e => e.preventDefault()}
    >
      <SubmitButton
        onClick={handleSubmit}
        pendingText={t('submit_button_loading')}
      >
        {t('submit_button')}
      </SubmitButton>
      {children}
    </form>
  )
}

