'use client'

import { FormEvent, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { checkInAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { UseGeolocationResult, useGeolocation } from '@/lib/geolocation'

interface Props {
  className?: string
}

export const CheckInForm: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const t = useTranslations('CheckIn')
  const { requestLocation, events } = useGeolocation()
  const [location, setLocation] = useState<UseGeolocationResult>()

  const init = async (e: FormEvent) => {

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

  // useEffect(() => {
  //   void init().catch(console.error)
  // }, [])

  return (
    <form
      className={classNames('flex flex-col justify-end', className)}
      onSubmit={e => e.preventDefault()}
    >
      <input
        type="number"
        name="latitude"
        hidden
        value={location?.latitude ?? ''}
        readOnly
      />
      <input
        type="number"
        name="longitude"
        hidden
        value={location?.longitude ?? ''}
        readOnly
      />
      <SubmitButton onClick={init} pendingText={t('submit_button_loading')}>
        {t('submit_button')}
      </SubmitButton>
      {children}
    </form>
  )
}

