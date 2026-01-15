import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { name, description, sector, status, deliveryDate } = body;

        await query(
            'UPDATE projects SET name = ?, description = ?, sector = ?, status = ?, deliveryDate = ? WHERE id = ?',
            [name, description, sector, status, deliveryDate || null, id]
        );

        return NextResponse.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await query('DELETE FROM projects WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
