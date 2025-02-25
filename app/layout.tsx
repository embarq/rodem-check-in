import { Inter, Noto_Sans_KR } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/footer'
import { HeaderAuth } from '@/components/header-auth'
import { ToastProvider } from '@/components/toast/toast-provider'
import { defaultUrl } from '@/lib/config'
import './globals.css'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Rodem | Check In',
  description: 'Rodem school - check in system',
}

const inter = Inter({
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '800'],
  preload: true,
  variable: '--font-inter',
})

const notoSansKr = Noto_Sans_KR({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  preload: true,
  variable: '--font-noto-sans-kr',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const selectedFont = locale.includes('ko') ? notoSansKr : inter

  return (
    <html
      lang={locale}
      className={selectedFont.variable}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <main className="flex min-h-screen flex-col items-center">
                <div className="flex w-full flex-1 flex-col items-center gap-5">
                  <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                    <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                      <HeaderAuth />
                    </div>
                  </nav>
                  <div className="flex w-full max-w-5xl flex-1 flex-col gap-20 p-5">
                    {children}
                  </div>
                  <Footer />
                </div>
              </main>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

