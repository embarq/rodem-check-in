import { createClient } from '@/utils/supabase/server'
import { UserProfile } from './model'

export type CompleteSignUpPayload = Pick<UserProfile, 'user_id'> &
  Partial<
    Pick<UserProfile, 'user_id' | 'name' | 'phone' | 'email' | 'metadata'>
  >

export const completeSignUp = async (
  payload: CompleteSignUpPayload,
): Promise<any> => {
  const supabase = await createClient()

  return supabase.from('profiles').insert<CompleteSignUpPayload>(payload, {
    count: 'estimated',
  })
}

