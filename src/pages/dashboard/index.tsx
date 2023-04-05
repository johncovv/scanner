import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { resolve } from 'path';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { readdirSync } from 'fs';

import { BiChevronDown } from 'react-icons/bi';
import { IoMdExit } from 'react-icons/io';
import { BsFolder } from 'react-icons/bs';
import { useState } from 'react';

import Logo from '@/assets/logo-without-text.png';
import {
	Header,
	HeaderContainer,
	LogoContainer,
	MainContainer,
	SideBar,
	Content,
	Folder,
	File,
	IconContainer,
} from '@/styles/dashboard.style';
import type { TDataTree, TDataTreeFolder, TDataTreeFile } from '@/modules/tree';
import { handleFile, handleFolder } from '@/shared/handles';
import type { TProjectSetting } from '@/modules/project';
import { TPublicUser } from '@/@types/iron-session';
import { FILE_TYPES } from '@/shared/file-tipes';
import { environment } from '@/config/env';

type TProps = {
	user: Pick<TPublicUser, 'email' | 'name'>;
	project: {
		id: string;
		name: string;
	};
	projectTree: TDataTree;
};

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: TProps }> {
		const user: TPublicUser = context.req.session.user!;

		const { serverRuntimeConfig } = getConfig();
		const { projectsList } = serverRuntimeConfig;

		const targetProject = projectsList.find((project: TProjectSetting) => project.id === user.projectId);

		if (!targetProject) throw new Error('Project not found');

		const staticFolderPath = resolve(process.cwd(), 'static', targetProject.folder_name);
		const directoryInfo = await readdirSync(staticFolderPath, { withFileTypes: true });

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

		return {
			props: {
				user: { name: user.name, email: user.email },
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
			secure: process.env.NODE_ENV === 'production',
		},
	}
);

export default function Dashboard(props: TProps) {
	const router = useRouter();

	const [projectTree, setProjectTree] = useState<TDataTree>(props.projectTree);
	const [user] = useState(props.user);

	const [iframeFile, setIframeFile] = useState<TDataTreeFile | null>(null);

	const toggleFolder = (id: string, tree: TDataTree): TDataTree => {
		return tree.map((item) => {
			if (item.type === 'folder') {
				if (item.id === id) {
					return {
						...item,
						isOpen: !item.isOpen,
					};
				} else {
					return {
						...item,
						leaf: toggleFolder(id, item.leaf),
					};
				}
			} else {
				return item;
			}
		});
	};

	const handleFolderClick = (id: string) => {
		const newTree = toggleFolder(id, projectTree);
		setProjectTree(newTree);
	};

	const handleFileClick = (file: TDataTreeFile) => {
		setIframeFile(file);
	};

	const renderTree = (leaf: TDataTree[number]) => {
		if (leaf.type === 'folder') {
			return (
				<Folder key={leaf.id} isOpen={leaf.isOpen} data-folder data-open={leaf.isOpen}>
					<button
						className="folder__title"
						disabled={leaf.leaf.length === 0}
						onClick={(e) => {
							e.stopPropagation();
							handleFolderClick(leaf.id);
						}}
					>
						<IconContainer>
							<BsFolder size={20} />
						</IconContainer>

						<span data-title>{leaf.title}</span>

						<span className="arrow">
							<BiChevronDown size={20} />
						</span>
					</button>

					<div className="folder__container">
						<div className="folder__content">{leaf.leaf.map((item: any) => renderTree(item))}</div>
					</div>
				</Folder>
			);
		} else {
			return (
				<File
					key={leaf.id}
					isSelected={iframeFile?.id === leaf.id}
					onClick={(e) => {
						e.stopPropagation();
						handleFileClick(leaf);
					}}
				>
					<IconContainer>
						{(() => {
							const Icon = FILE_TYPES[leaf.ext];

							return <Icon size={20} />;
						})()}
					</IconContainer>

					<span data-title>{leaf.title}</span>
					<span>.{leaf.ext}</span>
				</File>
			);
		}
	};

	const handleLogout = async () => {
		const res = await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (res.ok) router.push('/login');
	};

	return (
		<>
			<Header>
				<HeaderContainer data-container>
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
				</HeaderContainer>
			</Header>

			<MainContainer data-container>
				<SideBar>{projectTree.map((item) => renderTree(item))}</SideBar>

				<Content>{iframeFile && <iframe src={`/api/static/${props.project.id}/${iframeFile.path}`} />}</Content>
			</MainContainer>
		</>
	);
}
