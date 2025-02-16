export type FormActionMessage =
  | { success: string }
  | { error: string }
  | { message: string }

export interface UserProfile {
  id: number
  user_id: string
  name: string
  phone: string
  email: string
  metadata: string
}
