import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export function getSupabaseAdmin() {
	if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		throw new Error(
			'Supabase är inte konfigurerat. Lägg till SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY.'
		);
	}

	return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
	});
}
