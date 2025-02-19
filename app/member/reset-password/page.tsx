import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CommonLayout } from '@/app/(auth-pages)/common-layout'
import { resetPasswordAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormActionMessage } from '@/lib/model'
import { maybeTranslateFormMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

export default async function ResetPassword(props: {
  searchParams: Promise<FormActionMessage>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const searchParams = await props.searchParams
  const t = await getTranslations('ResetPassword')
  const formMessage = maybeTranslateFormMessage(searchParams, t)

  return (
    <CommonLayout title={t('title')} description={t('description')}>
      <Label htmlFor="password">{t('new_password_field_label')}</Label>
      <Input
        type="password"
        name="password"
        placeholder={t('new_password_field_placeholder')}
        required
      />
      <Label htmlFor="confirmPassword">
        {t('confirm_password_field_label')}
      </Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder={t('confirm_password_field_placeholder')}
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        {t('reset_password_button_label')}
      </SubmitButton>
      <footer className="pt-4">
        <FormMessage message={formMessage} />
      </footer>
    </CommonLayout>
  )
}

