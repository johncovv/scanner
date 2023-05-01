import { useState } from "react";
import Image from "next/image";

import Logo from "@/assets/completed-logo.png";
import { MainContainer, LogoContainer, Form, InputControl, SubmitButton } from "@/styles/login.style";

export async function getStaticProps() {
	return {
		props: {
			static: true,
		},
	};
}

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!username || !password) {
			alert("Port favor, preencha todos os campos!");
			return;
		}

		// send the post request to the server

		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		const data = await response.json();

		if (data.error) {
			alert(data.error);
			return;
		}

		if (data.user.isAdmin) {
			window.location.assign("/admin");
		} else {
			window.location.assign("/dashboard");
		}
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
					<label htmlFor="username">Usuário</label>

					<input
						type="text"
						id="username"
						value={username}
						required
						placeholder="Ex: jose123"
						onChange={(e) => setUsername(e.target.value)}
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
