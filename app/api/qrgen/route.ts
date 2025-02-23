import { NextRequest, NextResponse } from 'next/server'
import assert from 'assert'
import * as qrcode from 'qrcode'
import { generateHMAC } from '@/lib/crypto'
import { dayjs } from '@/lib/utils'

const qrCacheExpiration = 60 * 60 * 23 // 23 hours

export async function GET(request: NextRequest) {
  assert.ok(process.env.QR_SECRET)
  assert.ok(process.env.QR_KEY_SIG)

  const authHeader =
    request.headers.get('authorization') ||
    request.nextUrl.searchParams.get('api_key')

  if (authHeader !== process.env.QR_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const date = dayjs().utc().format('YYYY-MM-DD')
    const key = await generateHMAC(process.env.QR_KEY_SIG, date)
    const url = new URL('/member/check-in', request.url)

    url.searchParams.append('key', key)

    const qrCodeData = await qrcode.toString(url.toString(), {
      type: 'svg',
      width: 512,
      errorCorrectionLevel: 'low',
    })
    const file = new File([qrCodeData], `check-in-${date}.svg`, {
      type: 'image/svg+xml',
    })

    return new NextResponse(await file.arrayBuffer(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${qrCacheExpiration}`,
      },
    })
  } catch (error) {
    console.error(error)

    return new Response((error as Error).message, {
      status: 500,
    })
  }
}

