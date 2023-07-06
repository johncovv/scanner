import getConfig from "next/config";
import Head from "next/head";

import { useState } from "react";

import { Container, ActionsContainer, Button, Table } from "@/styles/pages/admin.style";
import { ConfirmModal, TConfirmModalProps } from "@/components/ConfirmModal";
import type { TPublicProjectSettingComplete } from "@/@types/project";
import { useToastMessages } from "@/context/toastMessages.context";
import { withPageSession } from "@/shared/functions/page-session";
import type { TPublicUser } from "@/@types/session";
import { Header } from "@/components/Header.component";

type TAdminProps = {
	user: TPublicUser;
	projectsList: Array<TPublicProjectSettingComplete>;
};

export default function Dashboard(props: TAdminProps) {
	const { addMessage, updateMessage } = useToastMessages();

	const [projectsList, setProjectsList] = useState<TAdminProps["projectsList"]>(props.projectsList);

	async function handleProjectsUpdate() {
		const { id } = addMessage({ type: "loading", message: "Atualizando projetos..." });

		try {
			const response = await fetch("/api/projects/update", {
				method: "PUT",
			});

			if (!response.ok) throw new Error("Failed to dispatch projects update");

			const data = await response.json();
			setProjectsList(data);

			updateMessage(id, { type: "success", message: "Projetos atualizadas com sucesso!" }, { delay: 300 });
		} catch (error: any) {
			updateMessage(id, { type: "error", message: error?.ptMessage ?? "Falha ao atualizar projetos!" }, { delay: 300 });
		}
	}

	function renderUpdateProjectsButton() {
		const props: TConfirmModalProps = {
			title: "Atualizar projetos",
			message: "Tem certeza que deseja atualizar as informações de projetos?",

			onConfirm: handleProjectsUpdate,
		};

		return (
			<ConfirmModal {...props}>
				<Button type="button" onClick={handleProjectsUpdate}>
					Atualizar projetos
				</Button>
			</ConfirmModal>
		);
	}

	return (
		<>
			<Head>
				<title>Administração - Risti Projetos</title>
				<link rel="icon" href="/favicon.ico" data-original />
			</Head>

			<Header user={props.user} />

			<Container data-container>
				<Table>
					<thead>
						<tr>
							<th>Project name</th>
							<th>Owner</th>
						</tr>
					</thead>

					<tbody>
						{projectsList.map((project) => (
							<tr key={project.id}>
								<td>{project.name}</td>
								<td>{project.owner.username}</td>
							</tr>
						))}
					</tbody>
				</Table>

				<ActionsContainer>
					<div data-title>Ações disponíveis:</div>

					<div data-content>{renderUpdateProjectsButton()}</div>
				</ActionsContainer>
			</Container>
		</>
	);
}

export const getServerSideProps = withPageSession(async function (context): Promise<{ props: TAdminProps }> {
	const { projectsList } = structuredClone(getConfig().serverRuntimeConfig);

	for (let project of projectsList) {
		delete project.owner["password"];
	}

	return {
		props: {
			user: context.session,
			projectsList,
		},
	};
});
