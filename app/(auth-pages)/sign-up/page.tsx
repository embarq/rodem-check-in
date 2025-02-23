import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { FormMessage } from '@/components/form-message'
import type { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage, parseRedirectConfig } from '@/lib/utils'
import { SignUpFormControls } from './form-controls'

export default async function Signup(props: {
  searchParams: Promise<FormActionMessage & { redirect_conf: string }>
}) {
  const { redirect_conf, ...searchParams } = await props.searchParams
  const t = await getTranslations('SignUp')
  const result = maybeTranslateFormMessage(searchParams, t)
  const redirectConfig = redirect_conf
    ? parseRedirectConfig(redirect_conf)
    : void 0

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
      <SignUpFormControls redirectConfig={redirectConfig} />
      <footer className="pt-4">
        <FormMessage message={result} />
      </footer>
    </CommonLayout>
  )
}

