import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const trails = db.prepare('SELECT * FROM trails ORDER BY sparks_count DESC, created_at DESC').all();
    const allSkills = db.prepare('SELECT id, name, category, radiance FROM skills').all();
    const skillMap = new Map((allSkills as any[]).map((s) => [s.id, s]));

    const parsedTrails = trails.map((t: any) => {
      let skillIds: string[] = [];
      try {
        skillIds = JSON.parse(t.skill_ids);
      } catch {
        skillIds = [];
      }

      const skills = skillIds.map((id) => skillMap.get(id)).filter(Boolean);

      return {
        ...t,
        skills,
      };
    });

    return NextResponse.json({ trails: parsedTrails });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json({ error: 'Failed to fetch trails' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trailId } = body;

    if (!trailId) {
      return NextResponse.json({ error: 'Trail ID required' }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare('UPDATE trails SET sparks_count = sparks_count + 1 WHERE id = ?');
    stmt.run(trailId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error lighting trail:', error);
    return NextResponse.json({ error: 'Failed to light trail' }, { status: 500 });
  }
}

