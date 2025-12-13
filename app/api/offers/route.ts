import { supabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * API endpoint for fetching offers for search
 * Used by SearchDialog to fetch offers on-demand
 */
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('offers')
            .select('id, name, offer, logo, category_main, is_featured, is_hidden_gem')
            .order('is_featured', { ascending: false })
            .limit(500);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('[api/offers] Failed to fetch offers:', error);
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}
