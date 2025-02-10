import { createClient } from '@/utils/supabase/server'
import { UserProfile } from './model'
import { profilesTableName } from './db'

export const getUserProfile = async (
  payload: Pick<UserProfile, 'user_id'>,
): Promise<{ data: null | UserProfile; error: null | Error }> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(profilesTableName)
    .select('*')
    .eq('user_id', payload.user_id)
    .single()
  return { data, error }
}

