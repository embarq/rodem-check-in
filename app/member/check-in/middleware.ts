import { NextResponse } from 'next/server'
import { NextMiddlewareComponent } from '@/lib/types'

export const middleware: NextMiddlewareComponent = (req, meta) => {
  if (!req.nextUrl.pathname.startsWith('/member/check-in')) {
    return
  }

  if (meta.user == null || meta.user?.error) {
    const key = req.nextUrl.searchParams.get('key')

    if (!key) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    const redirectConfig = Buffer.from(
      JSON.stringify({ pathname: '/member/check-in', query: { key } }),
    ).toString('base64')
    const url = new URL('/sign-in', req.url)

    url.searchParams.set('redirect_conf', redirectConfig)

    return NextResponse.redirect(url)
  }
}
