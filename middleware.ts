import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { middleware as checkInMiddleware } from './app/member/check-in/middleware'
import { NextMiddlewareComponent } from './lib/types'

const middlewares: NextMiddlewareComponent[] = [
  // prettier-ignore
  checkInMiddleware,
]

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const user = await updateSession(request)

  // protected routes
  if (request.nextUrl.pathname.startsWith('/member/reset-password') && user.error) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // if (request.nextUrl.pathname === '/' && !user.error) {
  //   return NextResponse.redirect(new URL('/member/check-in', request.url))
  // }

  for (const m of middlewares) {
    const result = m(request, { event, user })

    if (result) return result
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

