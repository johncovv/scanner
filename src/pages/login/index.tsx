import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';

import Logo from '@/assets/completed-logo.png';
import { MainContainer, LogoContainer, Form, InputControl, SubmitButton } from '@/styles/login.style';

export default function LoginPage() {
	const router = useRouter();

	const [password, setPassword] = useState('password');
	const [email, setEmail] = useState('user@mail.com');

	const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!email || !password) {
			alert('Port favor, preencha todos os campos!');
			return;
		}

		// send the post request to the server

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.error) {
			alert(data.message);
			return;
		}

		router.push('/dashboard');
	};

	return (
		<MainContainer>
			<div data-color></div>
			<div data-color></div>
			<div data-color></div>

			<LogoContainer>
				<Image src={Logo} alt="the website logo" />
			</LogoContainer>

			<Form onSubmit={onSubmit}>
				<InputControl>
					<label htmlFor="email">Email</label>

					<input
						type="email"
						id="email"
						value={email}
						required
						placeholder="Ex: jose.luiz@mail.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</InputControl>

				<InputControl>
					<label htmlFor="password">Password</label>

					<input
						type="password"
						id="password"
						value={password}
						required
						minLength={6}
						placeholder="*****"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</InputControl>

				<SubmitButton type="submit">Entrar</SubmitButton>
			</Form>
		</MainContainer>
	);
}
