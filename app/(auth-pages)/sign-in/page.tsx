import Link from 'next/link'
import { useState } from 'react'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { signInAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage, parseRedirectConfig } from '@/lib/utils'

export default async function Login(props: {
  searchParams: Promise<FormActionMessage & { redirect_conf: string }>
}) {
  const { redirect_conf, ...searchParams } = await props.searchParams
  const t = await getTranslations('SignIn')
  const formMessage = maybeTranslateFormMessage(searchParams, t)
  const redirectConfig = redirect_conf
    ? parseRedirectConfig(redirect_conf)
    : void 0

  const formAction = async (formData: FormData) => {
    'use server'
    await signInAction(formData, redirectConfig)
  }

  return (
    <CommonLayout
      title={t('title')}
      description={
        <>
          {t('sign_up_hint')}{' '}
          <Link
            className="font-medium text-foreground underline"
            href={
              redirect_conf
                ? `/sign-up?redirect_conf=${redirect_conf}`
                : '/sign-up'
            }
          >
            {t('sign_up_link')}
          </Link>
        </>
      }
    >
      <Label htmlFor="username">{t('username_field_label')}</Label>
      <Input
        name="username"
        placeholder={t('username_field_placeholder')}
        required
        autoComplete="username"
      />
      <div className="flex items-center justify-between">
        <Label htmlFor="password">{t('password_field_label')}</Label>
        <Link
          className="text-xs text-foreground underline"
          href="/forgot-password"
        >
          {t('forgot_password_link')}
        </Link>
      </div>
      <Input
        type="password"
        name="password"
        placeholder={t('password_field_placeholder')}
        required
      />
      <SubmitButton
        pendingText={t('sign_in_button_loading')}
        formAction={formAction}
      >
        {t('sign_in_button')}
      </SubmitButton>
      <FormMessage message={formMessage} />
    </CommonLayout>
  )
}

