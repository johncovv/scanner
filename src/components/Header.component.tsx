import { IoMdExit } from "react-icons/io";

import router from "next/router";
import Image from "next/image";

import { Container, Content, TitleContainer, LogoContainer } from "@/styles/components/Header.style";
import { TasksDropdown } from "@/components/TasksDropdown.component";
import type { TPublicUser } from "@/@types/session";
import type { TProjectSetting } from "@/@types/project";
import Logo from "@/assets/logo-without-text.png";
import LogoTreeSales from "@/assets/logo-treesales.png";

interface IHeaderProps {
	user: Pick<TPublicUser, "username">;
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

	function renderLogo() {
		switch (project?.type) {
			case "TREESALES":
				return <Image src={LogoTreeSales} alt="The website logo" />;
			default:
				return <Image src={Logo} alt="The website logo" />;
		}
	}

	return (
		<Container>
			<Content data-container>
				<TitleContainer>
					<LogoContainer>{renderLogo()}</LogoContainer>

					<h2 data-title>{project?.name}</h2>
				</TitleContainer>

				<div data-user>
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
