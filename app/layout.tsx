import HeaderAuth from '@/components/header-auth'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import Footer from '@/components/footer'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3033'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Rodem | Check In',
  description: 'Rodem school - check in system',
}

const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  preload: true,
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={poppins.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-screen flex-col items-center">
              <div className="flex w-full flex-1 flex-col items-center gap-20">
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
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

