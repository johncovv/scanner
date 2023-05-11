import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

import { MainContainer, LogoContainer, Form, InputControl, SubmitButton } from "@/styles/pages/login.style";
import { useToastMessages } from "@/context/toastMessages.context";
import Logo from "@/assets/completed-logo.png";

export async function getStaticProps() {
	return {
		props: {
			static: true,
		},
	};
}

export default function LoginPage() {
	const { addMessage, updateMessage } = useToastMessages();

	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!username || !password) {
			addMessage({ type: "error", message: "Port favor, preencha todos os campos!", duration: 3000 });
			return;
		}

		// send the post request to the server

		const { id } = addMessage({ type: "loading", message: "Fazendo login..." });

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (!response.ok) throw new Error(data.ptMessage ?? data.message);

			// update the message to success and redirect
			updateMessage(id, { type: "success", message: "Login feito com sucesso!", duration: 3000 });

			if (data.user.isAdmin) {
				window.location.assign("/admin");
			} else {
				window.location.assign("/dashboard");
			}
		} catch (error: any) {
			const errorMessage = error?.ptMessage ?? "Ocorreu um erro ao fazer login, tente novamente mais tarde!";

			updateMessage(id, { type: "error", message: errorMessage, duration: 3000 });
		}
	};

	return (
		<>
			<Head>
				<title>Login - Risti Scanner</title>
			</Head>

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
		</>
	);
}
