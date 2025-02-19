import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'
import { z } from 'zod'
import { UserResponse } from '@supabase/supabase-js'

export type NextMiddlewareComponent = (
  request: NextRequest,
  meta: {
    event: NextFetchEvent
    user?: UserResponse
  },
) => ReturnType<NextMiddleware>

export const RedirectConfigSchema = z.discriminatedUnion('pathname', [
  z.object({
    pathname: z.literal('/member/check-in'),
    query: z.object({ key: z.string() }),
  }),
])

export type RedirectConfig = z.infer<typeof RedirectConfigSchema>

