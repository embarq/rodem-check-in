import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { forgotPasswordAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage } from '@/lib/utils'

export default async function ForgotPassword(props: {
  searchParams: Promise<FormActionMessage>
}) {
  const searchParams = await props.searchParams
  const t = await getTranslations('ForgotPassword')
  const formMessage = maybeTranslateFormMessage(searchParams, t)

  return (
    <CommonLayout
      title={t('title')}
      description={
        <>
          {t('sign_in_hint')}{' '}
          <Link className="text-primary underline" href="/sign-in">
            {t('sign_in_link')}
          </Link>
        </>
      }
    >
      <Label htmlFor="email">{t('email_field_label')}</Label>
      <Input name="email" placeholder="you@example.com" required />
      <SubmitButton formAction={forgotPasswordAction}>
        {t('reset_password_button')}
      </SubmitButton>
      <FormMessage message={formMessage} />
    </CommonLayout>
  )
}

