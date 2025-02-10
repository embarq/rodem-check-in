import { completeSignUp } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const supabase = await createClient()
    const res = await supabase.auth.exchangeCodeForSession(code)

    if (res.data.user == null) {
      console.error(new Error('Missing user data'))
      return NextResponse.redirect(`${origin}/sign-up`)
    }

    try {
      const { error } = await completeSignUp({
        user_id: res.data.user.id,
        name: res.data.user.user_metadata.name,
      })
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/member/check-in`)
}

