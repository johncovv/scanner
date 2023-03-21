import { getIronSession } from 'iron-session/edge';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { environment } from '@/config/env';

export default {
	match: '/dashboard',
	exec: async function (req: NextRequest): Promise<NextResponse> {
		const response = NextResponse.next();

		const session = await getIronSession(req, response, {
			cookieName: environment.passport.cookie_name,
			password: environment.passport.password,
			cookieOptions: {
				// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
				secure: process.env.NODE_ENV === 'production',
			},
		});

		const { user } = session;

		if (!user) {
			return NextResponse.redirect(new URL('/login', req.url));
		}

		return response;
	},
};
