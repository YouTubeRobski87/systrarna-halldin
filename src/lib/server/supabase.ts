import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export class SupabaseConfigurationError extends Error {}

function getSupabaseCredentials() {
	return {
		url: env.SUPABASE_URL?.trim(),
		serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY?.trim()
	};
}

export function getSupabaseConfigurationError() {
	const { url, serviceRoleKey } = getSupabaseCredentials();
	if (!url || !serviceRoleKey) {
		return 'Orderdatabasen är inte konfigurerad. Lägg till SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i Render och deploya om.';
	}
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== 'https:') return 'SUPABASE_URL måste använda HTTPS.';
		if (parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash) {
			return 'SUPABASE_URL måste vara Supabase-projektets rotadress, utan sökväg eller parametrar.';
		}
	} catch {
		return 'SUPABASE_URL är inte en giltig URL.';
	}
	return null;
}

export function getSupabaseAdmin() {
	const configurationError = getSupabaseConfigurationError();
	if (configurationError) throw new SupabaseConfigurationError(configurationError);
	const { url, serviceRoleKey } = getSupabaseCredentials();
	if (!url || !serviceRoleKey)
		throw new SupabaseConfigurationError('Supabase saknar konfiguration.');

	return createClient(url, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
	});
}
