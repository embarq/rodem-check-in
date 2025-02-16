import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { checkInAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export default async function CheckInPage(props: {
  searchParams: Promise<FormActionMessage>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const searchParams = await props.searchParams
  const t = await getTranslations('ResetPassword')
  const formMessage = maybeTranslateFormMessage(searchParams, t)

  return (
    <form className="flex w-full flex-1 flex-col justify-end h-full">
      <SubmitButton
        formAction={checkInAction}
        pendingText={t('submit_button_loading')}
      >
        {t('submit_button')}
      </SubmitButton>
      <FormMessage message={formMessage} />
    </form>
  )
}

