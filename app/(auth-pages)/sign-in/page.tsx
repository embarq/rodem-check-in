import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { FormMessage } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage, parseRedirectConfig } from '@/lib/utils'
import { SignInFormControls } from './form-controls'

export default async function Login(props: {
  searchParams: Promise<FormActionMessage & { redirect_conf: string }>
}) {
  const { redirect_conf, ...searchParams } = await props.searchParams
  const t = await getTranslations('SignIn')
  const formMessage = maybeTranslateFormMessage(searchParams, t)
  const redirectConfig = redirect_conf
    ? parseRedirectConfig(redirect_conf)
    : void 0

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
        type="tel"
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
      <SignInFormControls redirectConfig={redirectConfig} />
      <FormMessage message={formMessage} />
    </CommonLayout>
  )
}

