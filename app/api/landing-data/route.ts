import { NextResponse } from 'next/server';
import { getLandingData } from '@/lib/landing-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getLandingData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
