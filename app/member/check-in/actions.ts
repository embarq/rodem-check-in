'use server'

import { isPointInPolygon } from 'geolib'
import * as config from '@/lib/config'
import { attendanceTableName, profilesTableName } from '@/lib/db'
import { dayjs } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from '@/utils/utils'

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

  if (config.checkInTargetGeolocation == null) {
    console.error(new Error('Target geolocation is not set'))

    return encodedRedirect('error', '/member/check-in', 'message_error_unknown')
  }

  const target = config.checkInTargetGeolocation
  const isWithinBounds = isPointInPolygon(userCoords, [
    target.n,
    target.e,
    target.s,
    target.w,
  ])

  if (isWithinBounds) {
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

