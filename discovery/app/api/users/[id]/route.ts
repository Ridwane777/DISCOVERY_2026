import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { firstName, lastName, email, role, status } = body;

        await query(
            'UPDATE users SET firstName = ?, lastName = ?, email = ?, role = ?, status = ? WHERE id = ?',
            [firstName, lastName, email, role, status, id]
        );

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await query('DELETE FROM users WHERE id = ?', [id]);
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
