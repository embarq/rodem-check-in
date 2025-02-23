'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { signInAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { Toast } from '@/components/toast'
import { AppActionResult } from '@/lib/model'
import { RedirectConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  redirectConfig?: RedirectConfig
}

export function SignInFormControls(props: Props) {
  const t = useTranslations('SignIn')
  const [actionResult, setActionResult] = useState<AppActionResult | null>(null)

  const formAction = async (formData: FormData) => {
    if (actionResult != null) {
      setActionResult(null)
      return
    }

    const res = await signInAction(formData, props.redirectConfig)

    setActionResult(res)
  }

  return (
    <>
      <SubmitButton
        pendingText={t('sign_in_button_loading')}
        formAction={formAction}
      >
        {t('sign_in_button')}
      </SubmitButton>
      <Toast
        title={
          !actionResult?.success && (
            <p className="flex items-center gap-x-2 text-destructive">
              {t('message_error_title')}
            </p>
          )
        }
        description={actionResult?.message && t(actionResult.message)}
        isOpen={actionResult != null}
        onChange={isOpen => !isOpen && setActionResult(null)}
        className={cn({
          'border-b-4 border-b-destructive': !actionResult?.success,
        })}
      />
    </>
  )
}

