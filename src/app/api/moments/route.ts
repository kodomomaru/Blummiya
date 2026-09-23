import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { extractHiddenSkills } from '@/lib/skills/extractor';

export async function GET() {
  try {
    const db = getDb();
    const moments = db
      .prepare(
        `SELECT m.*, 
                GROUP_CONCAT(s.name, '|||') as skill_names,
                GROUP_CONCAT(s.category, '|||') as skill_categories
         FROM moments m
         LEFT JOIN moment_skills ms ON m.id = ms.moment_id
         LEFT JOIN skills s ON ms.skill_id = s.id
         GROUP BY m.id
         ORDER BY m.created_at DESC`
      )
      .all();

    // Parse the joined skills
    const parsedMoments = moments.map((m: any) => {
      const names = m.skill_names ? m.skill_names.split('|||') : [];
      const categories = m.skill_categories ? m.skill_categories.split('|||') : [];
      const skills = names.map((name: string, i: number) => ({
        name,
        category: categories[i] || 'craft',
      }));

      return {
        ...m,
        skills,
      };
    });

    return NextResponse.json({ moments: parsedMoments });
  } catch (error) {
    console.error('Error fetching moments:', error);
    return NextResponse.json({ error: 'Failed to fetch moments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, narrative, context, impact } = body;

    if (!title || !narrative) {
      return NextResponse.json({ error: 'Title and narrative are required' }, { status: 400 });
    }

    const safeContext = ['work', 'life', 'craft', 'community'].includes(context) ? context : 'work';
    const analysis = extractHiddenSkills({
      title,
      narrative,
      context: safeContext,
      impact,
    });

    const db = getDb();
    const now = new Date().toISOString();
    const momentId = `moment-${Date.now()}`;

    // 1. Insert Moment
    const insertMoment = db.prepare(`
      INSERT INTO moments (id, title, narrative, context, impact, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertMoment.run(momentId, title, narrative, safeContext, impact || '', now);

    // 2. Insert or update Skills
    const findSkill = db.prepare('SELECT * FROM skills WHERE id = ?');
    const updateSkill = db.prepare(`
      UPDATE skills 
      SET radiance = MIN(100, radiance + ?),
          moments_count = moments_count + 1,
          updated_at = ?
      WHERE id = ?
    `);
    const insertSkill = db.prepare(`
      INSERT INTO skills (id, name, category, description, is_tacit, radiance, moments_count, x, y, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMomentSkill = db.prepare(`
      INSERT OR REPLACE INTO moment_skills (moment_id, skill_id, contribution)
      VALUES (?, ?, ?)
    `);

    // Coordinate clusters per category
    const clusterPositions: Record<string, { cx: number; cy: number }> = {
      human: { cx: 270, cy: 350 },
      cognitive: { cx: 480, cy: 220 },
      craft: { cx: 680, cy: 360 },
      inner: { cx: 440, cy: 520 },
    };

    for (const skill of analysis.skills) {
      const existing = findSkill.get(skill.id) as any;
      if (existing) {
        updateSkill.run(skill.radianceBoost, now, skill.id);
      } else {
        const cluster = clusterPositions[skill.category] || { cx: 500, cy: 400 };
        // Add pleasant organic jitter
        const jitterX = (Math.random() - 0.5) * 120;
        const jitterY = (Math.random() - 0.5) * 120;
        const x = Math.max(80, Math.min(920, cluster.cx + jitterX));
        const y = Math.max(80, Math.min(720, cluster.cy + jitterY));

        insertSkill.run(
          skill.id,
          skill.name,
          skill.category,
          skill.description,
          skill.isTacit ? 1 : 0,
          Math.min(100, 20 + skill.radianceBoost),
          1,
          x,
          y,
          now,
          now
        );
      }

      insertMomentSkill.run(momentId, skill.id, skill.contribution);
    }

    // 3. Connect links
    const findLink = db.prepare(`
      SELECT * FROM trail_links 
      WHERE (source_id = ? AND target_id = ?) OR (source_id = ? AND target_id = ?)
    `);
    const updateLink = db.prepare(`
      UPDATE trail_links SET strength = strength + 1 WHERE id = ?
    `);
    const insertLink = db.prepare(`
      INSERT INTO trail_links (id, source_id, target_id, strength)
      VALUES (?, ?, ?, ?)
    `);

    for (const conn of analysis.suggestedConnections) {
      const existingLink = findLink.get(conn.sourceId, conn.targetId, conn.targetId, conn.sourceId) as any;
      if (existingLink) {
        updateLink.run(existingLink.id);
      } else {
        const linkId = `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        insertLink.run(linkId, conn.sourceId, conn.targetId, 1);
      }
    }

    // Fetch refreshed graph state
    const allSkills = db.prepare('SELECT * FROM skills ORDER BY radiance DESC').all();
    const allLinks = db.prepare('SELECT * FROM trail_links').all();

    return NextResponse.json({
      success: true,
      momentId,
      analysis,
      skills: allSkills,
      links: allLinks,
    });
  } catch (error) {
    console.error('Error creating moment:', error);
    return NextResponse.json({ error: 'Failed to process spark' }, { status: 500 });
  }
}

