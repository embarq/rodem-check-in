import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CheckInForm } from '@/components/check-in-form'
import { FormMessage } from '@/components/form-message'
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
  const t = await getTranslations('CheckIn')
  const formMessage = maybeTranslateFormMessage(searchParams, t)

  return (
    <CheckInForm className="w-full h-full flex-1">
      <FormMessage message={formMessage} />
    </CheckInForm>
  )
}

