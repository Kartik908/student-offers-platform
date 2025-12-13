import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation API
 * Clears ISR cache for specified paths when data changes
 * 
 * Usage: POST /api/revalidate
 * Body: { "paths": ["/", "/tools"] }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const paths = body.paths as string[] || ['/', '/tools'];

        // Revalidate each path
        for (const path of paths) {
            revalidatePath(path);
        }

        return NextResponse.json({
            revalidated: true,
            paths,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { error: 'Failed to revalidate' },
            { status: 500 }
        );
    }
}

// Also support GET for easy testing
export async function GET() {
    revalidatePath('/');
    revalidatePath('/tools');

    return NextResponse.json({
        revalidated: true,
        paths: ['/', '/tools'],
        timestamp: new Date().toISOString(),
    });
}
