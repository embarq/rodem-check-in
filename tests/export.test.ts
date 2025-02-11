import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test'
import { NextRequest } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { GET } from '@/app/api/export/route'

type SupabaseClientFrom = ReturnType<SupabaseClient['from']>

describe('GET /api/export', () => {
  const mockApiKey = 'test-key' as const

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_KEY = mockApiKey
  })

  beforeEach(() => {
    //
  })

  test('return 401 if authorization header is missing', async () => {
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(new Headers()),
    }))

    const req = new NextRequest('http://localhost/api/export')
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  test('return 401 if authorization header is incorrect', async () => {
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({
          authorization: 'wrong-key',
        }),
      ),
    }))

    const req = new NextRequest('http://localhost/api/export')
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  test('return 400 if required query params are missing', async () => {
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({ authorization: mockApiKey }),
      ),
    }))

    const req = new NextRequest('http://localhost/api/export?invalid=params')
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toHaveProperty('error')
  })

  test('return 400 if query params are invalid', async () => {
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({ authorization: mockApiKey }),
      ),
    }))

    const url = new URL('http://localhost/api/export')

    url.search = new URLSearchParams({ offset: '-20', limit: '10' }).toString()

    const req = new NextRequest(url.toString())
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toHaveProperty('error')
  })

  test('return 200 and data if request is valid', async () => {
    const clientMock: Partial<SupabaseClient> = {
      from: mock().mockReturnValue({
        select: mock().mockReturnValue({
          range: mock().mockResolvedValue({ data: [], count: 0, error: null }),
        } as unknown as ReturnType<SupabaseClientFrom['select']>),
      } as unknown as SupabaseClientFrom),
    }

    mock.module('@/utils/supabase/server', () => ({
      createClient: () => clientMock as SupabaseClient,
    }))
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({ authorization: mockApiKey }),
      ),
      cookies: mock().mockResolvedValueOnce({
        getAll: mock().mockReturnValue(null),
        setAll: mock().mockReturnValue(null),
      }),
    }))

    const url = new URL('http://localhost/api/export')

    url.search = new URLSearchParams({ offset: '0', limit: '10' }).toString()

    const req = new NextRequest(url.toString())
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('count')
    expect(json).toHaveProperty('offset')
    expect(json).toHaveProperty('limit')
  })

  test.only('return 200 and data if request is valid', async () => {
    const clientMock: Partial<SupabaseClient> = {
      from: mock().mockReturnValue({
        select: mock().mockReturnValue({
          range: mock().mockResolvedValue({ data: [], count: 0, error: null }),
          gt: mock().mockReturnThis(),
        } as unknown as ReturnType<SupabaseClientFrom['select']>),
      } as unknown as SupabaseClientFrom),
    }

    mock.module('@/utils/supabase/server', () => ({
      createClient: () => clientMock as SupabaseClient,
    }))
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({ authorization: mockApiKey }),
      ),
      cookies: mock().mockResolvedValueOnce({
        getAll: mock().mockReturnValue(null),
        setAll: mock().mockReturnValue(null),
      }),
    }))

    const url = new URL('http://localhost/api/export')

    url.search = new URLSearchParams({
      offset: '0',
      limit: '10',
      'filters[created_at][gt]': (1739278455870 / 1000).toFixed(),
    }).toString()

    const req = new NextRequest(url.toString())
    const response = await GET(req)
    const json = await response.json()

    console.log(url.toString(), json)

    expect(response.status).toBe(200)
    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('count')
    expect(json).toHaveProperty('offset')
    expect(json).toHaveProperty('limit')
  })

  test('return 500 if there is an internal error', async () => {
    const clientMock: Partial<SupabaseClient> = {
      from: mock().mockReturnValue({
        select: mock().mockReturnValue({
          range: mock().mockResolvedValue({
            data: [],
            count: 0,
            error: new Error('Supabase error'),
          }),
        } as unknown as ReturnType<SupabaseClientFrom['select']>),
      } as unknown as SupabaseClientFrom),
    }

    mock.module('@/utils/supabase/server', () => ({
      createClient: () => clientMock as SupabaseClient,
    }))
    mock.module('next/headers', () => ({
      headers: mock().mockResolvedValueOnce(
        new Headers({ authorization: mockApiKey }),
      ),
      cookies: mock().mockResolvedValueOnce({
        getAll: mock().mockReturnValue(null),
        setAll: mock().mockReturnValue(null),
      }),
    }))

    const req = new NextRequest('http://localhost/api/export?offset=0&limit=10')
    const response = await GET(req)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toHaveProperty('error', 'Internal error')
  })
})

