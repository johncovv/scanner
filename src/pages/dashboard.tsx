import getConfig from "next/config";
import { readdirSync } from "fs";
import { resolve } from "path";
import Head from "next/head";

import { IoFileTrayOutline } from "react-icons/io5";
import Spreadsheet from "react-spreadsheet";
import { useState } from "react";

import { TDashboardProps, handleFile, handleFolder } from "@/shared/functions/dashboard.functions";
import type { TDataTree, TDataTreeFile, TDataTreeFolder } from "@/@types/tree";
import { MainContainer, SideBar, Content } from "@/styles/pages/dashboard.style";
import { toggleFolder } from "@/shared/functions/toggleFolder";
import { withPageSession } from "@/shared/functions/page-session";
import type { TPublicUser } from "@/@types/session";
import type { TProjectSetting } from "@/@types/project";
import { EAllowedFileTypes } from "@/@types/file-types.enum";
import { Header } from "@/components/Header.component";
import { Leaf } from "@/components/Leaf.component";
import { environment } from "@/config/env";

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

	function getSpecialFileUrl(file: TDataTreeFile, type: "office" | "googleDocs") {
		const officeDocReaderUrl = "https://view.officeapps.live.com/op/embed.aspx?src=";
		const googleDocReaderUrl = "https://docs.google.com/gview?embedded=true&url=";

		const host = window.location.origin;

		const readerUrl = type === "office" ? officeDocReaderUrl : googleDocReaderUrl;

		return `${readerUrl}${host}/api/static/${props.project.id}/${file.path}`;
	}

	async function handleFileClick(file: TDataTreeFile) {
		switch (file.ext) {
			case EAllowedFileTypes.doc:
			case EAllowedFileTypes.docx:
				setSpecialFileData(getSpecialFileUrl(file, "googleDocs"));
				break;
			case EAllowedFileTypes.xls:
			case EAllowedFileTypes.xlsx:
				setSpecialFileData(getSpecialFileUrl(file, "office"));
				break;
			default:
				setSpecialFileData(null);
				break;
		}

		// after handling the special data, set the selected file
		setSelectedFile(file);
		setContentKey((value) => value + 1);
	}

	function handleDownloadFile(file: TDataTreeFile) {
		const link = `/api/static/${props.project.id}/${file.path}?download=true`;

		window.open(link, "_blank", "noopener,noreferrer");
	}

	function renderSelectedFile() {
		if (!selectedFile) return;

		switch (selectedFile.ext) {
			case EAllowedFileTypes.xlsx:
			case EAllowedFileTypes.xls:
			case EAllowedFileTypes.doc:
			case EAllowedFileTypes.docx:
				return <iframe data-docx-preview src={specialFileData} width="1366px" height="623px" frameBorder="0" />;
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

			<Header user={props.user} project={props.project} />

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
								handleDownloadFile,
							}}
						/>
					))}
				</SideBar>

				<Content key={contentKey}>{selectedFile ? renderSelectedFile() : renderEmptyContent()}</Content>
			</MainContainer>
		</>
	);
}

export const getServerSideProps = withPageSession(async function (context): Promise<{ props: TDashboardProps }> {
	const user: TPublicUser = context.session;

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

	const { owner: _o, ...publicProject } = targetProject;

	return {
		props: {
			user,
			project: publicProject,
			projectTree: [...rootFolders, ...rootFiles],
		},
	};
});
