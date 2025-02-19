import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
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
    <form className="flex min-w-64 flex-1 flex-col">
      <h1 className="text-2xl font-medium">{t('title')}</h1>
      <p className="text-sm text-foreground">
        {t('sign_up_hint')}{' '}
        <Link className="font-medium text-foreground underline" href="/sign-up">
          {t('sign_up_link')}
        </Link>
      </p>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">{t('email_field_label')}</Label>
        <Input name="email" placeholder="you@example.com" required />
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
          formAction={signInAction}
        >
          {t('sign_in_button')}
        </SubmitButton>
        <FormMessage message={formMessage} />
      </div>
    </form>
  )
}

