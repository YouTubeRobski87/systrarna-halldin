import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export class SupabaseConfigurationError extends Error {}

export function getSupabaseConfigurationError() {
	if (!env.SUPABASE_URL?.trim() || !env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
		return 'Orderdatabasen är inte konfigurerad. Lägg till SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i Render och deploya om.';
	}
	try {
		const url = new URL(env.SUPABASE_URL);
		if (url.protocol !== 'https:') return 'SUPABASE_URL måste använda HTTPS.';
	} catch {
		return 'SUPABASE_URL är inte en giltig URL.';
	}
	return null;
}

export function getSupabaseAdmin() {
	const configurationError = getSupabaseConfigurationError();
	if (configurationError) throw new SupabaseConfigurationError(configurationError);
	const url = env.SUPABASE_URL;
	const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !serviceRoleKey)
		throw new SupabaseConfigurationError('Supabase saknar konfiguration.');

	return createClient(url, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
	});
}
