import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const deliverables = await query(`
      SELECT 
        d.*, 
        p.name as project,
        u.firstName as assignedToFirstName,
        u.lastName as assignedToLastName
      FROM deliverables d
      LEFT JOIN projects p ON d.projectId = p.id
      LEFT JOIN users u ON d.assignedTo = u.id
    `);

        // Format names for frontend
        const formattedDeliverables = (deliverables as any[]).map(d => ({
            ...d,
            assignedTo: d.assignedToFirstName ? `${d.assignedToFirstName} ${d.assignedToLastName}` : 'Unassigned'
        }));

        return NextResponse.json(formattedDeliverables);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch deliverables' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, projectId, format, deadline, assignedTo } = body;

        const deliverableId = crypto.randomUUID();

        await query(
            'INSERT INTO deliverables (id, name, projectId, format, deadline, assignedTo) VALUES (?, ?, ?, ?, ?, ?)',
            [deliverableId, name, projectId, format, deadline || null, assignedTo || null]
        );

        return NextResponse.json({ id: deliverableId, name, projectId, format, deadline, assignedTo }, { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create deliverable' }, { status: 500 });
    }
}
