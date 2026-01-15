import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const projects = await query(`
      SELECT 
        p.*, 
        (SELECT COUNT(*) FROM project_admins WHERE projectId = p.id) as adminCount,
        (SELECT COUNT(*) FROM deliverables WHERE projectId = p.id) as deliverablesCount,
        (SELECT COUNT(*) FROM deliverables WHERE projectId = p.id AND status = 'pending') as pendingDeliverables
      FROM projects p
    `);
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, sector, deliveryDate, admins } = body;

        const projectId = crypto.randomUUID();

        await query(
            'INSERT INTO projects (id, name, description, sector, deliveryDate) VALUES (?, ?, ?, ?, ?)',
            [projectId, name, description, sector, deliveryDate || null]
        );

        // If admins are provided, link them
        if (admins && Array.isArray(admins)) {
            for (const adminId of admins) {
                await query('INSERT INTO project_admins (projectId, userId) VALUES (?, ?)', [projectId, adminId]);
            }
        }

        return NextResponse.json({ id: projectId, name, description, sector, deliveryDate }, { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
