'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Locale } from '@/i18n/config'
import { setUserLocale } from '@/lib/locale'

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const [mounted, setMounted] = useState(false)
  const locale = useLocale() as Locale

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center sm:space-x-2">
          <span>{t('label')}:</span>
          <Button variant="ghost" size={'sm'} className="text-xl">
            {locale === 'en' ? '🇬🇧' : locale === 'kr' ? '🇰🇷' : '🇷🇺'}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={e => setUserLocale(e as Locale)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="kr">
            🇰🇷 <span>{t('options.kr')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="en">
            🇬🇧 <span>{t('options.en')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="ru">
            🇷🇺 <span>{t('options.ru')}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

