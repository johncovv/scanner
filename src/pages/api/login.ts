import { withIronSessionApiRoute } from 'iron-session/next';

import type { TUser } from '@/@types/iron-session.d';
import { environment } from '@/config/env';

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		if (req.method !== 'POST') {
			return res.status(405).send({ ok: false, error: 'method not allowed' });
		}

		const { email, password } = await req.body;

		const mockUser: TUser = {
			email: 'user@mail.com',
			password: 'password',
			name: 'John Doe',
			projectId: 'project-123',
		};

		// check if the email and password are correct

		const emailIsCorrect = email === mockUser.email;
		const passwordIsCorrect = password === mockUser.password;

		if (!passwordIsCorrect || !emailIsCorrect) {
			return res.status(401).send({ ok: false, error: 'email/password is incorrect' });
		}

		// get user from database then:
		req.session.user = mockUser;

		await req.session.save();
		return res.send({ ok: true });
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24,
			expires: new Date(Date.now() + 60 * 60 * 24),
			sameSite: 'lax',
		},
	}
);
