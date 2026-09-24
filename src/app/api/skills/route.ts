import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const skills = db.prepare('SELECT * FROM skills ORDER BY radiance DESC').all();
    const links = db.prepare('SELECT * FROM trail_links').all();

    return NextResponse.json(
      {
        skills,
        links,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch living pathway',
        message: error?.message || 'Unknown database error',
      },
      { status: 500 }
    );
  }
}

