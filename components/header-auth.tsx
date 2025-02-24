import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { signOutAction } from '@/app/actions'
import { createClient } from '@/utils/supabase/server'
import { Button } from './ui/button'

export async function HeaderAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const t = await getTranslations('Header')

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="font-bold uppercase tracking-widest opacity-50">
        Rodem | Check in
      </div>
      <form action={signOutAction}>
        {user ? (
          <Button type="submit" variant={'outline'}>
            {t('sign_out_link')}
          </Button>
        ) : (
          <Button asChild size="sm" variant={'outline'}>
            <Link href="/sign-in">{t('sign_in_link')}</Link>
          </Button>
        )}
      </form>
    </div>
  )
}

