import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext } from "next";

import { Container, ActionsContainer, Button, Table } from "@/styles/admin.style";
import type { TPublicProjectSettingComplete } from "@/@types/project";
import type { TPublicUser } from "@/@types/iron-session";
import { Header } from "@/components/Header.component";
import { environment } from "@/config/env";
import getConfig from "next/config";

type TAdminProps = {
	user: TPublicUser;
	projectsList: Array<Omit<TPublicProjectSettingComplete, "owner.password">>;
};

export default function Dashboard(props: TAdminProps) {
	async function handleProjectsUpdate() {
		const wasAccepted = window.confirm("Are you sure you want to re-scan all the projets?");

		if (wasAccepted) {
			await fetch("/api/projects/update", {
				method: "PUT",
			});
		}
	}

	return (
		<>
			<Header user={props.user} />

			<Container>
				<Table>
					<thead>
						<tr>
							<th>Project name</th>
							<th>Owner</th>
						</tr>
					</thead>

					<tbody>
						{props.projectsList.map((project) => (
							<tr key={project.id}>
								<td>{project.name}</td>
								<td>{project.owner.username}</td>
							</tr>
						))}
					</tbody>
				</Table>

				<ActionsContainer>
					<div data-title>Ações disponíveis:</div>

					<div data-content>
						<Button type="button" onClick={handleProjectsUpdate}>
							Dispatch projects update
						</Button>
					</div>
				</ActionsContainer>
			</Container>
		</>
	);
}

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: TAdminProps }> {
		const { projectsList } = structuredClone(getConfig().serverRuntimeConfig);

		for (let project of projectsList) {
			delete project.owner["password"];
		}

		return {
			props: {
				user: context.req.session.user!,
				projectsList,
			},
		};
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	}
);
