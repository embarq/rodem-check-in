import { getTranslations } from 'next-intl/server'
import { FormMessage } from '@/components/form-message'
import { FormActionMessage } from '@/lib/model'
import { CommonLayout } from '../(auth-pages)/common-layout'

export default async function SignUpSuccess() {
  const t = await getTranslations('SignUpSuccess')

  return (
    <CommonLayout
      title={t('title')}
      description={t('description')}
    ></CommonLayout>
  )
}

