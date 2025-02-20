import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { signUpAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage } from '@/lib/utils'

export default async function Signup(props: {
  searchParams: Promise<FormActionMessage & { redirect_conf: string }>
}) {
  const { redirect_conf, ...searchParams } = await props.searchParams
  const t = await getTranslations('SignUp')
  const result = maybeTranslateFormMessage(searchParams, t)
  const formAction = async (formData: FormData) => {
    'use server'
    await signUpAction(formData, redirect_conf)
  }

  if (result && 'message' in result) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={result} />
      </div>
    )
  }

  return (
    <CommonLayout
      title={t('title')}
      description={
        <>
          {t('existing_account')}{' '}
          <Link href="/sign-in" className="font-medium text-primary underline">
            {t('sign_in_button')}
          </Link>
        </>
      }
    >
      <Label htmlFor="name">
        {t('name_field_label')}
        <span className="ps-1 text-destructive">*</span>
      </Label>
      <Input name="name" placeholder="John Doe" required autoComplete="name" />
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
      />
      <SubmitButton
        formAction={formAction}
        pendingText={t('sign_up_button_loading')}
      >
        {t('sign_up_button')}
      </SubmitButton>
      <footer className="pt-4">
        <FormMessage message={result} />
      </footer>
    </CommonLayout>
  )
}

