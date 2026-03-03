import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: list user's conversation sessions
export async function GET() {
    const user = await currentUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { data, error } = await supabaseAdmin
        .from('conversation_memory')
        .select('id, session_id, summary, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(30);

    if (error) {
        console.error('Failed to fetch sessions', error);
        return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
}

// DELETE: delete a session
export async function DELETE(req: Request) {
    const user = await currentUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { sessionId } = await req.json();
    if (!sessionId) return new NextResponse('Missing sessionId', { status: 400 });

    await supabaseAdmin
        .from('conversation_memory')
        .delete()
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

    return NextResponse.json({ ok: true });
}

// PATCH: rename a session
export async function PATCH(req: Request) {
    const user = await currentUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { sessionId, summary } = await req.json();
    if (!sessionId || !summary) return new NextResponse('Missing fields', { status: 400 });

    await supabaseAdmin
        .from('conversation_memory')
        .update({ summary })
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

    return NextResponse.json({ ok: true });
}
