import { fail, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import {
	ADMIN_COOKIE,
	adminCookieOptions,
	createAdminSession,
	getAdminConfigurationError,
	validAdminPassword
} from '$lib/server/admin-auth';

const loginSchema = z.object({ password: z.string().min(1).max(1024) });

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const configurationError = getAdminConfigurationError();
		if (configurationError) {
			console.error('[admin login] ADMIN_PASSWORD is missing or empty.');
			return fail(503, { message: configurationError });
		}
		const parsed = loginSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success || !validAdminPassword(parsed.data.password)) {
			return fail(401, { message: 'Fel lösenord.' });
		}
		cookies.set(
			ADMIN_COOKIE,
			createAdminSession(),
			adminCookieOptions(url.protocol === 'https:' || process.env.NODE_ENV === 'production')
		);
		redirect(303, '/admin/orders');
	}
};
