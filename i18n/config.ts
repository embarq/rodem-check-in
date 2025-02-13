export type Locale = (typeof locales)[number]

export const locales = ['en', 'kr', 'ru'] as const
export const defaultLocale: Locale = 'en'

