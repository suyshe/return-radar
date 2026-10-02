import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function DELETE() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Account deletion is unavailable because Supabase is not configured.' },
      { status: 503 }
    );
  }

  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) {
    return NextResponse.json(
      { error: 'You must be signed in to delete your account.' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Account deletion requires SUPABASE_SERVICE_ROLE_KEY to be configured.');
    return NextResponse.json(
      { error: 'Account deletion is not configured. Please contact support.' },
      { status: 503 }
    );
  }

  const adminClient = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(data.user.id);
  if (deleteError) {
    console.error('Supabase failed to delete the authenticated account.', deleteError);
    return NextResponse.json(
      { error: 'Unable to delete your account right now. Please try again or contact support.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
