export interface AppActionResult {
  success: boolean
  message?: `message_${string}`
}

export function actionResult(
  success: boolean,
  message?: `message_${string}`,
): AppActionResult {
  return {
    success,
    message,
  }
}

export function validateActionResultMessage(
  message: string,
): asserts message is `message_${string}` {
  if (!message.startsWith('message_')) throw new Error('Invalid action message')
}

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

