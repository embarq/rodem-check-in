import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkInAction } from '../../actions'
import { SubmitButton } from '@/components/submit-button'
import { FormMessage, Message } from '@/components/form-message'

export default async function CheckInPage(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <form className="flex w-full flex-1 flex-col justify-end h-full">
      <SubmitButton formAction={checkInAction} pendingText="Loading...">
        Check in
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  )
}

