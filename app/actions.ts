'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'
import dayjsPluginUtc from 'dayjs/plugin/utc'
import { attendanceTableName, profilesTableName } from '@/lib/db'

dayjs.extend(dayjsPluginUtc)

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const name = formData.get('name')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  if (!email || !password) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Email and password are required',
    )
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
    return encodedRedirect('error', '/sign-up', error.message)
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.',
    )
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
    return encodedRedirect('error', '/sign-in', error.message)
  }

  return redirect('/member/check-in')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/member/reset-password`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password',
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.',
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/member/reset-password',
      'Password and confirm password are required',
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/member/reset-password',
      'Passwords do not match',
    )
  }

  const { error, data } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    const msg =
      error.code === 'same_password'
        ? 'Password is the same as the current password. Please choose another one.'
        : error.message

    return encodedRedirect('error', '/member/reset-password', msg)
  }

  return encodedRedirect(
    'success',
    '/member/reset-password',
    'Password updated',
  )
}

export const signOutAction = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/sign-in')
}

export const checkInAction = async () => {
  const baseTs = dayjs().utc().set('s', 0).set('ms', 0)
  const timestampLimit = baseTs.subtract(1, 'h').toISOString()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return encodedRedirect('error', '/member/check-in', 'User not found')
  }

  const { data: profile } = await supabase
    .from(profilesTableName)
    .select('id')
    .eq('user_id', user.id)
    .single()

  const recordsQuery = supabase
    .from(attendanceTableName)
    .select('id,user_profile_id,created_at', { count: 'exact' })
    .eq('user_profile_id', profile?.id)
    .order('created_at', { ascending: false })
    .gt('created_at', timestampLimit)
    .range(0, 1)
    .limit(1)
  const records = await recordsQuery

  if (records.error) {
    console.error({ ...records.error, src: 'checkInAction/recordsQuery' })
    return encodedRedirect('error', '/member/check-in', 'An error occurred')
  }

  if (records.count! > 0) {
    return encodedRedirect('error', '/member/check-in', 'Already checked in')
  }

  const { error } = await supabase.from(attendanceTableName).insert({
    user_profile_id: profile?.id,
    created_at: baseTs.toDate(),
  })

  if (error) {
    console.error({ ...error, src: 'checkInAction/attendanceQuery' })
    return encodedRedirect('error', '/member/check-in', 'An error occurred')
  }

  return encodedRedirect('success', '/member/check-in', 'Submission successful')
}

