import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export class SupabaseConfigurationError extends Error {}

export type SupabaseQueryError = {
	code?: string | null;
	message?: string | null;
	details?: string | null;
	hint?: string | null;
};

const connectionErrorCodes = new Set(['PGRST000', 'PGRST001', 'PGRST002', 'PGRST003']);

export function isSupabaseConnectionError(error: SupabaseQueryError | null | undefined) {
	if (error?.code && connectionErrorCodes.has(error.code)) return true;

	const description = [error?.message, error?.details, error?.hint]
		.filter(Boolean)
		.join(' ')
		.toLocaleLowerCase('en-US');

	return [
		'connection refused',
		'connection terminated',
		'connection timeout',
		'failed to fetch',
		'fetch failed'
	].some((fragment) => description.includes(fragment));
}

function getSupabaseCredentials() {
	return {
		url: env.SUPABASE_URL?.trim(),
		serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY?.trim()
	};
}

function getSupabaseProjectHost() {
	const { url } = getSupabaseCredentials();
	if (!url) return null;

	try {
		return new URL(url).host;
	} catch {
		return null;
	}
}

export function logSupabaseQueryError(
	context: string,
	error: SupabaseQueryError | null | undefined
) {
	console.error(context, {
		code: error?.code ?? null,
		message: error?.message ?? null,
		details: error?.details ?? null,
		hint: error?.hint ?? null,
		projectHost: getSupabaseProjectHost()
	});
}

export function logSupabaseUnavailable(context: string, cause: unknown) {
	const error = cause instanceof Error ? cause : null;
	console.error(context, {
		name: error?.name ?? typeof cause,
		message: error?.message ?? 'Okänt fel',
		projectHost: getSupabaseProjectHost()
	});
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
