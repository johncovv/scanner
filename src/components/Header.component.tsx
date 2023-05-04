import { IoMdClose, IoMdExit } from "react-icons/io";
import { useState } from "react";
import router from "next/router";
import Image from "next/image";

import { HiPlusSmall } from "react-icons/hi2";
import { BiEditAlt } from "react-icons/bi";

import { Container, Content, LogoContainer } from "@/styles/components/Header.style";
import { TasksDropdown } from "@/components/TasksDropdown.component";
import type { TPublicUser } from "@/@types/iron-session";
import type { TProjectSetting } from "@/@types/project";
import Logo from "@/assets/logo-without-text.png";
import type { TTask } from "@/@types/task";

interface IHeaderProps {
	user: Pick<TPublicUser, "username" | "name">;
	project?: TProjectSetting;
}

export function Header({ user, project }: IHeaderProps) {
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

					{project && <TasksDropdown project={project} />}

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
