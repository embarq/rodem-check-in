'use server'

import { cookies } from 'next/headers'
import { Locale, defaultLocale } from '@/i18n/config'

const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale() {
  const _cookies = await cookies()

  return _cookies.get(COOKIE_NAME)?.value || defaultLocale
}

export async function setUserLocale(locale: Locale) {
  const _cookies = await cookies()

  _cookies.set(COOKIE_NAME, locale)
}

