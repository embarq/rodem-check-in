import * as z from 'zod'
import { object } from 'zod'

const number = z.coerce.number
const date = z.coerce.date

export const UnixTimestampSchema = number()
  .int()
  .positive()
  .min(0)
  .max(3.250368e10)

const GetExportFiltersSchema = object({
  created_at: object({
    lt: date().or(UnixTimestampSchema),
    lte: date().or(UnixTimestampSchema),
    gt: date().or(UnixTimestampSchema),
    gte: date().or(UnixTimestampSchema),
  }).partial(),
})

export const GetExportParamsSchema = object({
  offset: number().int().min(0),
  limit: number().int().positive().max(100),
  filters: GetExportFiltersSchema.partial().optional(),
  order: object({
    created_at: z.enum(['asc', 'desc']),
  })
    .partial()
    .optional(),
})

export type GetExportParams = z.infer<typeof GetExportParamsSchema>

export type GetExportFilters = z.infer<typeof GetExportFiltersSchema>

