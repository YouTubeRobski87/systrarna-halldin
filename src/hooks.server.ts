import { redirect, type Handle } from '@sveltejs/kit';
import { ADMIN_COOKIE, isValidAdminSession } from '$lib/server/admin-auth';

export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isLoginRoute = event.url.pathname === '/admin/login';
	if (isAdminRoute && !isLoginRoute && !isValidAdminSession(event.cookies.get(ADMIN_COOKIE))) {
		redirect(303, '/admin/login');
	}
	return resolve(event);
};
