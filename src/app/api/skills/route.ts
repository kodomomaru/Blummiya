import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const skills = db.prepare('SELECT * FROM skills ORDER BY radiance DESC').all();
    const links = db.prepare('SELECT * FROM trail_links').all();

    return NextResponse.json({
      skills,
      links,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch living pathway' }, { status: 500 });
  }
}

