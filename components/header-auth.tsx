import { signOutAction } from '@/app/actions'
import Link from 'next/link'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function HeaderAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="font-bold uppercase tracking-widest opacity-50">
        Rodem | Check in
      </div>
      <form action={signOutAction}>
        {user ? (
          <Button type="submit" variant={'outline'}>
            Sign out
          </Button>
        ) : (
          <Button asChild size="sm" variant={'outline'}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </form>
    </div>
  )
}

