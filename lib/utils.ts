import { SupabaseClient } from '@supabase/supabase-js'
import { clsx, type ClassValue } from 'clsx'
import $dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { twMerge } from 'tailwind-merge'

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
          query = (query[op] as unknown as QueryBuilderFilter)(prop, value)
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

