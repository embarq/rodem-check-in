import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import qs from 'qs'
import { ZodError } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { attendanceTableName } from '@/lib/db'
import { mapQsFiltersToSupabaseFilters } from '@/lib/utils'
import { GetExportParamsSchema } from './validation'

export async function GET(req: NextRequest) {
  const authorization = (await headers()).get('authorization')

  if (authorization !== process.env.NEXT_PUBLIC_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const queryParamsMap = qs.parse(req.nextUrl.search, {
      ignoreQueryPrefix: true,
    })
    const { offset, limit, filters, order } =
      await GetExportParamsSchema.parseAsync(queryParamsMap)

    const supabase = await createClient(true)
    const attendanceQuery = supabase
      .from(attendanceTableName)
      .select(
        'id,user_profile_id,created_at,user_profile:profiles(id,user_id,name)',
        {
          count: 'estimated',
        },
      )
    const attendanceQueryWithFilters =
      filters != null || order != null
        ? mapQsFiltersToSupabaseFilters(attendanceQuery, filters, order)
        : attendanceQuery
    const { data, error, count } = await attendanceQueryWithFilters.range(
      offset,
      limit,
    )

    if (error) {
      throw error
    }

    return Response.json({ data, count, offset, limit })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: 'ValidationError', details: error.issues },
        { status: 400 },
      )
    }

    console.error({
      src: 'GET /api/export:attendanceQuery',
      error,
    })
    return Response.json(
      { error: 'Internal error', details: error },
      { status: 500 },
    )
  }
}

