import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
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
    <form className="mx-auto flex w-full min-w-64 max-w-64 flex-1 flex-col gap-2 text-foreground [&>input]:mb-6">
      <div>
        <h1 className="text-2xl font-medium">{t('title')}</h1>
        <p className="text-sm text-secondary-foreground">
          {t('sign_in_hint')}{' '}
          <Link className="text-primary underline" href="/sign-in">
            {t('sign_in_link')}
          </Link>
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">{t('email_field_label')}</Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton formAction={forgotPasswordAction}>
          {t('reset_password_button')}
        </SubmitButton>
        <FormMessage message={formMessage} />
      </div>
    </form>
  )
}

