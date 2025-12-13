import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Get country from Vercel header
    let country = request.headers.get('x-vercel-ip-country');

    // Fallback to 'IN' (India) when not on Vercel
    // This allows local testing of India-exclusive content
    // In production on Vercel, the header will be set automatically
    if (!country) {
        country = 'IN';
    }

    return NextResponse.json({
        country_code: country,
    });
}

