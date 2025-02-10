import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('GET export', req.nextUrl, req.headers)
  return Response.json({ data: [] })
}

