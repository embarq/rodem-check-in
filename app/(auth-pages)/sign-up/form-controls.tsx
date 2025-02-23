'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { signUpAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { Toast } from '@/components/toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppActionResult } from '@/lib/model'
import { RedirectConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FormDataProps {
  name?: string
  phone?: string
  email?: string
}

interface Props {
  redirectConfig?: RedirectConfig
}

export function SignUpFormControls(props: Props) {
  const t = useTranslations('SignUp')
  const [actionResult, setActionResult] = useState<AppActionResult | null>(null)
  const [form, setForm] = useState<FormDataProps | null>(null)

  const formAction = async (formData: FormData) => {
    if (actionResult != null) {
      setActionResult(null)
      return
    }

    setForm({
      name: formData.get('name')?.toString(),
      phone: formData.get('phone')?.toString(),
      email: formData.get('email')?.toString(),
    })
    const res = await signUpAction(formData, props.redirectConfig)

    setActionResult(res)
  }

  return (
    <>
      <Label htmlFor="name">
        {t('name_field_label')}
        <span className="ps-1 text-destructive">*</span>
      </Label>
      <Input
        name="name"
        placeholder="John Doe"
        required
        autoComplete="name"
        defaultValue={form?.name}
      />
      <Label htmlFor="phone">
        {t('phone_field_label')}
        <span className="ps-1 text-destructive">*</span>
      </Label>
      <Input
        type="tel"
        name="phone"
        placeholder={t('phone_field_placeholder')}
        required
        autoComplete="phone"
        defaultValue={form?.phone}
      />
      <Label htmlFor="password">
        {t('password_field_label')}
        <span className="ps-1 text-destructive">*</span>
      </Label>
      <Input
        type="password"
        name="password"
        placeholder={t('password_field_placeholder')}
        minLength={6}
        autoComplete="new-password"
        required
      />
      <Label htmlFor="email">{t('email_field_label')}</Label>
      <Input
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        defaultValue={form?.email}
      />
      <SubmitButton
        pendingText={t('sign_up_button_loading')}
        formAction={formAction}
      >
        {t('sign_up_button')}
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

