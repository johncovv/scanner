import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext } from "next";
import getConfig from "next/config";
import { readdirSync } from "fs";
import { resolve } from "path";
import Head from "next/head";

import { IoFileTrayOutline } from "react-icons/io5";
import Spreadsheet from "react-spreadsheet";
import { useState } from "react";

import { TDashboardProps, handleFile, handleFolder } from "@/shared/dashboard.functions";
import type { TDataTree, TDataTreeFile, TDataTreeFolder } from "@/@types/tree";
import { MainContainer, SideBar, Content } from "@/styles/pages/dashboard.style";
import { readExcelFile } from "@/shared/functions/read-excel-file";
import { renderDocxFile } from "@/shared/functions/read-word-file";
import { toggleFolder } from "@/shared/functions/toggleFolder";
import { Header } from "@/components/Header.component";
import type { TProjectSetting } from "@/@types/project";
import type { TPublicUser } from "@/@types/iron-session";
import { Leaf } from "@/components/Leaf.component";
import { environment } from "@/config/env";
import { EAllowedFileTypes } from "@/@types/file-types";

export default function Dashboard(props: TDashboardProps) {
	const headTitle = `${props.project.name} - Risti Scanner`;
	const headDescription = `Visualize os documentos do projeto ${props.project.name}`;

	const [projectTree, setProjectTree] = useState<TDataTree>(props.projectTree);
	const [selectedFile, setSelectedFile] = useState<TDataTreeFile | null>(null);
	const [specialFileData, setSpecialFileData] = useState<any>(null);
	const [contentKey, setContentKey] = useState<number>(0);

	function handleFolderClick(id: string) {
		const newTree = toggleFolder(id, projectTree);
		setProjectTree(newTree);
	}

	async function handleFileClick(file: TDataTreeFile) {
		switch (file.ext) {
			case EAllowedFileTypes.xlsx:
			case EAllowedFileTypes.xls:
				const excelFile = await readExcelFile(props.project.id, file);
				setSpecialFileData(excelFile);
				break;
			case EAllowedFileTypes.doc:
			case EAllowedFileTypes.docx:
				void renderDocxFile(props.project.id, file);
				break;
			default:
				setSpecialFileData(null);
				break;
		}

		// after handling the special data, set the selected file
		setSelectedFile(file);
		setContentKey((value) => value + 1);
	}

	function renderSelectedFile() {
		if (!selectedFile) return;

		switch (selectedFile.ext) {
			case EAllowedFileTypes.xlsx:
			case EAllowedFileTypes.xls:
				return <Spreadsheet data={specialFileData} />;
			case EAllowedFileTypes.doc:
			case EAllowedFileTypes.docx:
				return <div data-docx-preview></div>;
			default:
				return <iframe src={`/api/static/${props.project.id}/${selectedFile.path}`} />;
		}
	}

	function renderEmptyContent() {
		return (
			<div data-empty>
				<IoFileTrayOutline size={64} />

				<h2>Nenhum documento selecionado</h2>
				<p>selecione um documento para visualizar</p>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{headTitle}</title>
				<meta name="description" content={headDescription} />
			</Head>

			<Header user={props.user} />

			<MainContainer data-container>
				<SideBar>
					{projectTree.map((leaf) => (
						<Leaf
							key={leaf.id}
							leaf={leaf}
							selectedFileId={selectedFile?.id}
							handles={{
								handleFileClick,
								handleFolderClick,
							}}
						/>
					))}
				</SideBar>

				<Content key={contentKey}>{selectedFile ? renderSelectedFile() : renderEmptyContent()}</Content>
			</MainContainer>
		</>
	);
}

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: TDashboardProps }> {
		const user: TPublicUser = context.req.session.user!;

		// Get project settings

		const { serverRuntimeConfig } = getConfig();
		const { projectsList } = serverRuntimeConfig;

		const targetProject = projectsList.find((project: TProjectSetting) => project.id === user.projectId);

		if (!targetProject) throw new Error("Project not found");

		// Get project tree

		const staticFolderPath = resolve(environment.staticDir, targetProject.folder_name);
		const directoryInfo = await readdirSync(staticFolderPath, { withFileTypes: true });

		// Handle folders and files

		let rootFolders: Array<TDataTreeFolder> = [];
		let rootFiles: Array<TDataTreeFile> = [];

		for (const item of directoryInfo) {
			if (item.isFile()) {
				const file = await handleFile(item);
				if (file) rootFiles.push(file);
			} else {
				const folder = await handleFolder(item, staticFolderPath);
				if (folder) rootFolders.push(folder);
			}
		}

		// Sort folders and files

		rootFolders = rootFolders.sort((a, b) => (a.title > b.title ? 1 : -1));
		rootFiles = rootFiles.sort((a, b) => (a.title > b.title ? 1 : -1));

		// Return props

		return {
			props: {
				user: { name: user.name, username: user.username },
				project: {
					id: targetProject.id,
					name: targetProject.name,
				},
				projectTree: [...rootFolders, ...rootFiles],
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
