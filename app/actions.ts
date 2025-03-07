'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import assert from 'assert'
import { completeSignUp } from '@/lib/auth'
import {
  UserProfile,
  actionResult,
  validateActionResultMessage,
} from '@/lib/model'
import { RedirectConfig } from '@/lib/types'
import { createClient } from '@/utils/supabase/server'
import { encodedRedirect, redirectWithConfig } from '@/utils/utils'
import { SupabaseClient } from '@supabase/supabase-js'

export const signUpAction = async (
  formData: FormData,
  redirectConfig?: string | RedirectConfig,
) => {
  const password = formData.get('password')?.toString()!
  const name = formData.get('name')?.toString()!
  const phone = formData.get('phone')?.toString()!
  const email = formData.get('email')?.toString()! ?? getDefaultEmail(phone)
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  if (!phone || !password) {
    return actionResult(false, 'message_error_required_login')
  }

  const { error, data } = await supabase.auth.signUp({
    password,
    phone,
    options: {
      data: {
        email,
      },
      emailRedirectTo:
        typeof redirectConfig === 'string'
          ? `${origin}/auth/callback?redirect_conf=${redirectConfig}`
          : `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error(error.code + ' ' + error.message)
    const message = [
      'weak_password',
      'validation_failed',
      'phone_exists',
      'user_already_exists',
    ].includes(error.code!)
      ? 'message_error_' + error.code
      : 'message_error_unknown'

    validateActionResultMessage(message)

    return actionResult(false, message)
  } else {
    await postSignUp({
      origin,
      redirectConfig,
      supabase,
      user: {
        name,
        email,
        phone,
        user_id: data?.user?.id as string,
      },
    }).catch(console.error)

    if (typeof redirectConfig === 'object') {
      return redirectWithConfig(redirectConfig)
    }

    return redirect('/sign-up-success')
  }
}

/**
 * Sets up the user's profile after sign up.
 * Update the user's email and manage the email change redirect URL.
 */
async function postSignUp({
  supabase,
  origin,
  redirectConfig,
  user,
}: {
  supabase: SupabaseClient
  origin: string | null
  redirectConfig?: string | RedirectConfig
  user: Pick<UserProfile, 'user_id'> & Partial<UserProfile>
}): Promise<void> {
  const emailCallbackUrl = new URL(origin!)
  emailCallbackUrl.pathname = '/auth/callback'
  emailCallbackUrl.searchParams.set('redirect_to', '/member/check-in')

  if (redirectConfig != null) {
    const _redirectConfig =
      typeof redirectConfig === 'string'
        ? redirectConfig
        : Buffer.from(JSON.stringify(redirectConfig)).toString('base64')

    emailCallbackUrl.searchParams.set('redirect_conf', _redirectConfig)
  }

  const results = await Promise.allSettled([
    completeSignUp(user),
    supabase.auth.updateUser(
      { email: user.email },
      {
        emailRedirectTo: emailCallbackUrl.toString(),
      },
    ),
  ])
  const reject = results.find(result => result.status === 'rejected')

  reject?.reason && console.error(reject.reason)
}

function getDefaultEmail(substr: string): string {
  assert(process.env.SUPABASE_AUTH_DEFAULT_EMAIL)

  const baseEmail = process.env.SUPABASE_AUTH_DEFAULT_EMAIL
  const [id, domain] = baseEmail?.split('@')

  return [id, '+', substr, '@', domain].join('')
}

export const signInAction = async (
  formData: FormData,
  redirectConfig?: RedirectConfig,
) => {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    password,
    phone: username,
  })

  if (error) {
    if ('code' in error) {
      const message = 'message_error_' + error.code

      validateActionResultMessage(message)

      return actionResult(false, message)
    }
    return actionResult(false, 'message_error_unknown')
  }

  if (redirectConfig) {
    return redirectWithConfig(redirectConfig)
  }

  return redirect('/member/check-in')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect(
      'error',
      '/forgot-password',
      'message_error_email_required',
    )
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/member/reset-password`,
  })

  if (error) {
    console.error(error)
    return encodedRedirect('error', '/forgot-password', 'message_error_unknown')
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect('success', '/forgot-password', 'message_success')
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/member/reset-password',
      'message_error_missing_required_fields',
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/member/reset-password',
      'message_error_confirm_password',
    )
  }

  const { error, data } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    const msg =
      error.code === 'same_password'
        ? 'message_error_same_password'
        : 'message_error_unknown'

    console.error(error)

    return encodedRedirect('error', '/member/reset-password', msg)
  }

  return encodedRedirect('success', '/member/reset-password', 'message_success')
}

export const signOutAction = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/sign-in')
}

