import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
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
    <form className="mx-auto flex min-w-64 max-w-64 flex-col">
      <h1 className="text-2xl font-medium">{t('title')}</h1>
      <p className="text text-sm text-foreground">
        {t('existing_account')}{' '}
        <Link className="font-medium text-primary underline" href="/sign-in">
          {t('sign_in_button')}
        </Link>
      </p>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="name">{t('name_field_label')}</Label>
        <Input
          name="name"
          placeholder="John Doe"
          required
          autoComplete="name"
        />
        <Label htmlFor="email">{t('email_field_label')}</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Label htmlFor="password">{t('password_field_label')}</Label>
        <Input
          type="password"
          name="password"
          placeholder={t('password_field_placeholder')}
          minLength={6}
          required
        />
        <SubmitButton
          formAction={signUpAction}
          pendingText={t('sign_up_button_loading')}
        >
          {t('sign_up_button')}
        </SubmitButton>
        <footer className="pt-4">
          <FormMessage message={result} />
        </footer>
      </div>
    </form>
  )
}

