import { type ClassValue, clsx } from 'clsx'
import $dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { useTranslations } from 'next-intl'
import type { getTranslations } from 'next-intl/server'
import { twMerge } from 'tailwind-merge'
import type { FormActionMessage } from '@/lib/model'
import type { SupabaseClient } from '@supabase/supabase-js'

$dayjs.extend(utc)

export const dayjs = $dayjs

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type SupabaseQueryBuilder = ReturnType<
  ReturnType<SupabaseClient['from']>['select']
>

export function mapQsFiltersToSupabaseFilters<
  Q extends SupabaseQueryBuilder,
  F extends object,
>(query: Q, filters?: F, orderBy?: Partial<Record<string, 'asc' | 'desc'>>): Q {
  type QueryBuilderFilter = (column: string, value: unknown) => Q

  const operatorMap = {
    eq: 'eq',
    neq: 'neq',
    lt: 'lt',
    lte: 'lte',
    gt: 'gt',
    gte: 'gte',
  } as const

  if (filters != null && Object.keys(filters).length) {
    for (const [prop, _filters] of Object.entries(filters)) {
      for (const [operator, value] of Object.entries(_filters)) {
        if (operator in operatorMap) {
          const op = operatorMap[operator as keyof typeof operatorMap]
          const nextOp = query[op] as unknown as QueryBuilderFilter

          query = nextOp.apply(query, [prop, maybeStringifyDate(value)])
        }
      }
    }
  }

  if (orderBy != null && Object.keys(orderBy).length) {
    const [prop, direction] = Object.entries(orderBy)[0]

    query = query.order(prop, {
      ascending: direction === 'asc',
    })
  }

  return query
}

function maybeStringifyDate(value: unknown): unknown {
  return value instanceof Date ? dayjs(value).toISOString() : value
}

export function maybeTranslateFormMessage(
  msg: FormActionMessage,
  t:
    | Awaited<ReturnType<typeof getTranslations>>
    | ReturnType<typeof useTranslations>,
): FormActionMessage | null {
  switch (true) {
    case 'success' in msg:
      return { success: t(msg.success) }
    case 'error' in msg:
      return { error: t(msg.error) }
    case 'message' in msg:
      return { message: t(msg.message) }
    default:
      return null
  }
}

