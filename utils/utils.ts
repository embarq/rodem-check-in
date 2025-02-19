import { RedirectType, redirect } from 'next/navigation'
import { defaultUrl } from '@/lib/config'
import { RedirectConfig } from '@/lib/types'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
  redirectType?: RedirectType,
) {
  return redirect(
    `${path}?${type}=${encodeURIComponent(message)}`,
    redirectType,
  )
}

export function redirectWithConfig(config: RedirectConfig) {
  const { pathname, query } = config
  const url = new URL(pathname, defaultUrl)

  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return redirect(url.href.replace(url.origin, ''))
}

