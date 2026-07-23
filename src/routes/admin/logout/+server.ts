import { redirect } from '@sveltejs/kit';
import { ADMIN_COOKIE } from '$lib/server/admin-auth';

export const POST = ({ cookies }) => {
	cookies.delete(ADMIN_COOKIE, { path: '/admin' });
	redirect(303, '/admin/login');
};
