import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const users = await query('SELECT id, firstName, lastName, email, role, status, avatarColor, createdAt FROM users');
        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Detailed Database Error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            syscall: error.syscall,
            hostname: error.hostname
        });
        return NextResponse.json({
            error: `Database Error: ${error.message} (Code: ${error.code})`,
            details: error
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, role, password } = body;

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();
        const avatarColor = body.avatarColor || 'bg-indigo-600';

        await query(
            'INSERT INTO users (id, firstName, lastName, email, role, password, avatarColor) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, firstName, lastName, email, role || 'user', hashedPassword, avatarColor]
        );

        return NextResponse.json({
            id: userId,
            firstName,
            lastName,
            email,
            role,
            avatarColor
        }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
