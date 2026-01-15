import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { name, status, uploadedBy, fileSize } = body;

        const uploadedAt = body.status === 'received_ontime' || body.status === 'late' ? new Date() : null;

        await query(
            'UPDATE deliverables SET name = ?, status = ?, uploadedBy = ?, uploadedAt = ?, fileSize = ? WHERE id = ?',
            [name, status, uploadedBy || null, uploadedAt, fileSize || null, id]
        );

        return NextResponse.json({ message: 'Deliverable updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to update deliverable' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await query('DELETE FROM deliverables WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Deliverable deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete deliverable' }, { status: 500 });
    }
}
