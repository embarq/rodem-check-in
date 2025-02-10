import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { attendanceTableName } from '@/lib/db'

export async function GET(req: NextRequest) {
  const authorization = (await headers()).get('authorization')

  if (authorization !== process.env.NEXT_PUBLIC_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const queryParams = req.nextUrl.searchParams
    const { offset, limit } = validateParams(queryParams)
    const supabase = await createClient()

    const { data, error, count } = await supabase
      .from(attendanceTableName)
      .select('id,user_profile_id,created_at,user_profile:profiles(id,user_id,name)', {
        count: 'estimated',
      })
      .range(offset, limit)

    if (error) {
      throw error
    }

    return Response.json({ data, count, offset, limit })
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    console.error({
      ...(error as object),
      src: 'GET /api/export:attendanceQuery',
    })
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function validateParams(params: URLSearchParams) {
  const offset = parseInt(params.get('offset')!)
  const limit = parseInt(params.get('limit')!)

  if (Number.isNaN(offset) || Number.isNaN(limit)) {
    throw new ValidationError('Invalid request')
  }

  if (limit > 100) {
    throw new ValidationError('Limit too high. Max allowed limit is 100')
  }

  if (offset < 0) {
    throw new ValidationError('Negative offset is not allowed')
  }

  return {
    offset,
    limit,
  }
}

