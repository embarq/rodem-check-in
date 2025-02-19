import { z } from 'zod'

export const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3033'

export const checkInTargetGeolocation = parseTargetGeolocation(
  process.env.TARGET_GEOLOCATION,
)

export const checkInDebounceMinutes = parseInt(
  process.env.CHECK_IN_DEBOUNCE_MINUTES ?? '0',
)

function parseTargetGeolocation(value?: string) {
  const src = Buffer.from(z.string().base64().parse(value), 'base64').toString(
    'utf-8',
  )

  return z
    .object({
      n: z.tuple([z.number(), z.number()]),
      e: z.tuple([z.number(), z.number()]),
      s: z.tuple([z.number(), z.number()]),
      w: z.tuple([z.number(), z.number()]),
    })
    .parse(JSON.parse(src))
}

