import { IoMdExit } from "react-icons/io";
import router from "next/router";
import Image from "next/image";

import { Container, Content, LogoContainer } from "@/styles/components/Header.style";
import { TPublicUser } from "@/@types/iron-session";
import Logo from "@/assets/logo-without-text.png";

interface IHeaderProps {
	user: Pick<TPublicUser, "username" | "name">;
}

export function Header({ user }: IHeaderProps) {
	const handleLogout = async () => {
		const res = await fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) router.push("/login");
	};

	return (
		<Container>
			<Content data-container>
				<LogoContainer>
					<Image src={Logo} alt="The website logo" />
				</LogoContainer>

				<div data-user>
					<div>{user.name}</div>
					<div>|</div>
					<div>
						<a onClick={handleLogout} data-logout>
							<IoMdExit /> <span>Sair</span>
						</a>
					</div>
				</div>
			</Content>
		</Container>
	);
}
