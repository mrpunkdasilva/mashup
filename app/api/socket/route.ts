import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Socket service will be deployed separately' })
}