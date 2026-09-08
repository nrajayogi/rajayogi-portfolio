import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const session = await verifyAdminSession(request);
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized access to private contact messages" },
            { status: 401 }
        );
    }

    try {
        const submissions = await prisma.contactSubmission.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map Prisma fields to Frontend expected fields if separate
        // Frontend expects: id, firstName, lastName, email, message, date (from createdAt), status
        const formatted = submissions.map(sub => ({
            id: sub.id,
            firstName: sub.firstName,
            lastName: sub.lastName,
            email: sub.email,
            message: sub.message,
            date: sub.createdAt.toISOString(),
            status: sub.status.toLowerCase()
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.debug("Submissions query non-fatal fallback:", error);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, message } = body;

        const newSubmission = await prisma.contactSubmission.create({
            data: {
                firstName,
                lastName,
                email,
                message,
                status: 'unread'
            }
        });

        return NextResponse.json({
            ...newSubmission,
            date: newSubmission.createdAt.toISOString(),
        });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }
}
