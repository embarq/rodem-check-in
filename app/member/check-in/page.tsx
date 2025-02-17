import { redirect } from 'next/navigation'
import assert from 'assert'
import { getTranslations } from 'next-intl/server'
import { SafeParseReturnType, string } from 'zod'
import { CheckInForm } from '@/components/check-in-form'
import { FormMessage } from '@/components/form-message'
import { generateHMAC } from '@/lib/crypto'
import { FormActionMessage } from '@/lib/model'
import { dayjs, maybeTranslateFormMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export default async function CheckInPage(props: {
  searchParams: Promise<FormActionMessage & { key: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const t = await getTranslations('CheckIn')
  const { key, ...searchParams } = await props.searchParams
  const hasError = 'error' in searchParams
  const { error: keyFormatError } =
    (hasError || 'success' in searchParams) && key == null
      ? { error: null }
      : await validateKey(key)
  const formMessage = maybeTranslateFormMessage(
    keyFormatError ? { error: 'message_error_malformed_url' } : searchParams,
    t,
  )

  keyFormatError && console.error(keyFormatError)

  return (
    <CheckInForm className="w-full h-full flex-1">
      <FormMessage
        title={hasError ? t('message_error_title') : ''}
        message={formMessage}
      />
    </CheckInForm>
  )
}

function validateKey(
  keyRaw: string,
): Promise<SafeParseReturnType<string, string>> {
  return string()
    .length(64)
    .refine(
      async val => {
        assert.ok(process.env.QR_KEY_SIG)

        const date = dayjs().utc().format('YYYY-MM-DD')
        const key = await generateHMAC(process.env.QR_KEY_SIG, date)

        return val === key
      },
      { message: 'key_sig_mismatch' },
    )
    .safeParseAsync(keyRaw)
}

