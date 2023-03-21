import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';

import { environment } from '@/config/env';

export const middleware = async (req: NextRequest) => {
	const res = NextResponse.next();
	const session = await getIronSession(req, res, {
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

	// like mutate user:
	// user.something = someOtherThing;
	// or:
	// session.user = someoneElse;

	// uncomment next line to commit changes:
	// await session.save();
	// or maybe you want to destroy session:
	// await session.destroy();

	console.log('from middleware', { user });

	return res;
};

export const config = {
	matcher: '/dashboard',
};
