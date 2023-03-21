import { useRouter } from 'next/router';
import { useState } from 'react';

import { MainContainer, Form, InputControl, SubmitButton } from './styles';

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

		const response = await fetch('http://localhost:3000/api/login', {
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

				<SubmitButton type="submit">Login</SubmitButton>
			</Form>
		</MainContainer>
	);
}
