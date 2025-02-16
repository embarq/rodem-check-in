'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDistance } from 'geolib'
import * as config from '@/lib/config'
import { attendanceTableName, profilesTableName } from '@/lib/db'
import { dayjs } from '@/lib/utils'
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

const checkInTargetGeolocation = parseTargetGeolocation(
  config.checkInTargetGeolocation,
)

export const checkInAction = async ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => {
  const userCoords = { latitude, longitude }

  if (!userCoords) {
    return encodedRedirect(
      'error',
      '/member/check-in',
      'message_error_missing_geolocation_data',
    )
  }

  if (checkInTargetGeolocation == null) {
    console.error(new Error('Target geolocation is not set'))

    return encodedRedirect('error', '/member/check-in', 'message_error_unknown')
  }

  const distance = getDistance(userCoords, checkInTargetGeolocation, 0.1)

  if (distance > config.checkInTargetMaxDistance) {
    return encodedRedirect(
      'error',
      '/member/check-in',
      'message_error_too_far_from_the_target',
    )
  }

  const baseTs = dayjs().utc().set('s', 0).set('ms', 0)
  const timestampLimit = baseTs.subtract(1, 'h').toISOString()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return encodedRedirect(
      'error',
      '/member/check-in',
      'message_error_missing_user_data',
    )
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
    return encodedRedirect('error', '/member/check-in', 'message_error_unknown')
  }

  if (records.count! > 0) {
    return encodedRedirect(
      'error',
      '/member/check-in',
      'message_error_already_checked_in',
    )
  }

  const { error } = await supabase.from(attendanceTableName).insert({
    user_profile_id: profile?.id,
    created_at: baseTs.toDate(),
  })

  if (error) {
    console.error({ ...error, src: 'checkInAction/attendanceQuery' })
    return encodedRedirect('error', '/member/check-in', 'message_error_unknown')
  }

  return encodedRedirect('success', '/member/check-in', 'message_success')
}

function parseTargetGeolocation(value?: string) {
  const src = Buffer.from(value ?? '', 'base64').toString('utf-8')
  const [latitude, longitude] = src.split(',')

  return extractCoordinates(
    new Map([
      ['latitude', latitude],
      ['longitude', longitude],
    ]),
  )
}

function extractCoordinates(data: FormData | Map<string, string>) {
  const latitude = data.get('latitude')
  const longitude = data.get('longitude')

  if (typeof latitude !== 'string' || typeof longitude !== 'string') {
    return null
  }

  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  }
}

