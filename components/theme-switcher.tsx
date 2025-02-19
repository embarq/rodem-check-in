'use client'

import { useEffect, useState } from 'react'
import { Laptop, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ThemeSwitcher = () => {
  const t = useTranslations('ThemeSwitcher')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const ICON_SIZE = 16

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center sm:space-x-2">
          <span>{t('label')}:</span>
          <Button variant="ghost" size={'sm'}>
            {theme === 'light' ? (
              <Sun
                key="light"
                size={ICON_SIZE}
                className={'text-muted-foreground'}
              />
            ) : theme === 'dark' ? (
              <Moon
                key="dark"
                size={ICON_SIZE}
                className={'text-muted-foreground'}
              />
            ) : (
              <Laptop
                key="system"
                size={ICON_SIZE}
                className={'text-muted-foreground'}
              />
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={e => setTheme(e)}>
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('options.light')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('options.dark')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('options.system')}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeSwitcher }

