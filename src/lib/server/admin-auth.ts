import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const ADMIN_COOKIE = 'sh_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

const signature = (value: string) => createHmac('sha256', env.ADMIN_PASSWORD ?? '').update(value).digest('base64url');

export function validAdminPassword(value: string) {
	if (!env.ADMIN_PASSWORD) return false;
	const expected = Buffer.from(env.ADMIN_PASSWORD);
	const received = Buffer.from(value);
	return expected.length === received.length && timingSafeEqual(expected, received);
}

export function createAdminSession() {
	const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
	const payload = `admin.${expiresAt}`;
	return `${payload}.${signature(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
	if (!value || !env.ADMIN_PASSWORD) return false;
	const parts = value.split('.');
	if (parts.length !== 3 || parts[0] !== 'admin') return false;
	const expiresAt = Number(parts[1]);
	if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;
	const expected = Buffer.from(signature(`${parts[0]}.${parts[1]}`));
	const received = Buffer.from(parts[2]);
	return expected.length === received.length && timingSafeEqual(expected, received);
}

export const adminCookieOptions = (secure: boolean) => ({
	path: '/admin',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure,
	maxAge: SESSION_MAX_AGE
});
