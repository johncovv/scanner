import { withIronSessionApiRoute } from 'iron-session/next';
import getConfig from 'next/config';

import { environment } from '@/config/env';
import { TProjectSettingComplete } from '../../modules/project';

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		if (req.method !== 'POST') {
			return res.status(405).send({ ok: false, error: 'method not allowed' });
		}

		const { email, password } = await req.body;

		const { serverRuntimeConfig } = getConfig();
		const { projectsList } = serverRuntimeConfig as { projectsList: Array<TProjectSettingComplete> };

		const targetProject = projectsList.find((project) => project.owner.email === email);

		if (!targetProject) {
			return res.status(401).send({ ok: false, error: 'email/password is incorrect' });
		}

		// check if the email and password are correct

		const emailIsCorrect = email === targetProject.owner.email;
		const passwordIsCorrect = password === targetProject.owner.password;

		if (!passwordIsCorrect || !emailIsCorrect) {
			return res.status(401).send({ ok: false, error: 'email/password is incorrect' });
		}

		const { password: _, ...user } = targetProject.owner;

		// set the user in the session
		req.session.user = Object.assign(user, { projectId: targetProject.id });

		await req.session.save();
		return res.status(200).send({ ok: true });
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
