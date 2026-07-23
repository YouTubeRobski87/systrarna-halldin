import { fail, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import {
	ADMIN_COOKIE,
	adminCookieOptions,
	createAdminSession,
	validAdminPassword
} from '$lib/server/admin-auth';

const loginSchema = z.object({ password: z.string().min(1).max(1024) });

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
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
