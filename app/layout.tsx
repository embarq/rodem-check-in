import HeaderAuth from '@/components/header-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

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
  weight: ["400", "500", "600", "800"],
  preload: true,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
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

              <footer className="mx-auto flex w-full items-center justify-between gap-8 border-t px-5 py-4 text-center text-xs">
                <div className="flex items-center justify-center space-x-4">
                  Theme:
                  <ThemeSwitcher />
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

