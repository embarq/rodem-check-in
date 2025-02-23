'use client'

import { useState } from 'react'
import classNames from 'classnames'
import { CloudOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { checkInAction } from '@/app/member/check-in/actions'
import { SubmitButton } from '@/components/submit-button'
import { Toast } from '@/components/toast'
import { useGeolocation } from '@/lib/geolocation'
import { AppActionResult } from '@/lib/model'

interface Props {
  className?: string
  disabled?: boolean
}

export const CheckInForm: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  disabled = true,
}) => {
  const t = useTranslations('CheckIn')
  const { requestLocation } = useGeolocation()
  const [actionResult, setActionResult] = useState<AppActionResult | null>(null)

  const handleSubmit = async () => {
    try {
      const geolocation = await requestLocation()

      if (geolocation == null) {
        throw new Error('message_error_unknown')
      }

      if (actionResult != null) {
        setActionResult(null)
        return
      }

      const res = await checkInAction(geolocation)

      setActionResult(res)
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
        disabled={disabled}
        onClick={handleSubmit}
        pendingText={t('submit_button_loading')}
      >
        {t('submit_button')}
      </SubmitButton>
      <Toast
        title={
          !actionResult?.success && (
            <p className="flex items-center gap-x-2 text-destructive">
              <CloudOff size={18} />
              {t('message_error_title')}
            </p>
          )
        }
        description={actionResult?.message && t(actionResult.message)}
        isOpen={actionResult != null}
        onChange={isOpen => !isOpen && setActionResult(null)}
      />
      {children}
    </form>
  )
}

