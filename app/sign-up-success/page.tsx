import { getTranslations } from 'next-intl/server'
import { FormActionMessage } from '@/lib/model'
import { CommonLayout } from '../(auth-pages)/common-layout'
import { FormMessage } from '@/components/form-message'

export default async function SignUpSuccess(
  searchParams: Promise<FormActionMessage>,
) {
  const t = await getTranslations('SignUpSuccess')

  return (
    <CommonLayout title={t('title')} description={t('description')}>
    </CommonLayout>
  )
}

