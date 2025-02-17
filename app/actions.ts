'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from '@/utils/utils'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const name = formData.get('name')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  if (!email || !password) {
    return encodedRedirect('error', '/sign-up', 'message_error_required_login')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error(error.code + ' ' + error.message)
    return encodedRedirect('error', '/sign-up', 'message_error_unknown')
  } else {
    return encodedRedirect('success', '/sign-up', 'message_success')
  }
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if ('code' in error) {
      return encodedRedirect('error', '/sign-in', 'message_error_' + error.code)
    }
    return encodedRedirect('error', '/sign-in', 'message_error_unknown')
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

