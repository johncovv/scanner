import { IoMdExit } from "react-icons/io";
import { useState } from "react";
import router from "next/router";
import Image from "next/image";

import { Container, Content, LogoContainer } from "@/styles/components/Header.style";
import type { TCheckItem } from "@/components/CheckItem.component";
import CheckList from "@/components/CheckList.component";
import Dropdown from "@/components/Dropdown.component";
import type { TPublicUser } from "@/@types/iron-session";
import Logo from "@/assets/logo-without-text.png";

interface IHeaderProps {
	user: Pick<TPublicUser, "username" | "name">;
}

export function Header({ user }: IHeaderProps) {
	const [todo, setTodo] = useState<Array<TCheckItem>>([
		{ id: "1", name: "Item 1", checked: false },
		{ id: "2", name: "Item 2", checked: false },
	]);

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
					<Dropdown trigger={{ triggerTitle: "Todo" }}>
						<CheckList list={todo} allowAddMore updateList={(newList) => setTodo(newList)} />
					</Dropdown>
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
