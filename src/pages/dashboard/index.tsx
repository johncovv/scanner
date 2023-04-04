import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { resolve, extname } from 'path';
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
	HeaderLogoContainer,
	MainContainer,
	SideBar,
	Content,
	Folder,
	File,
	IconContainer,
} from '@/styles/dashboard.style';
import type { TDataTree, TDataTreeFolder, TDataTreeFile } from '@/modules/tree';
import type { TProjectSetting } from '@/modules/project';
import { TPublicUser } from '@/@types/iron-session';
import { FILE_TYPES } from '@/shared/file-tipes';
import { uuid } from '@/shared/generate-uuid';
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
				const fileExt = extname(item.name).slice(1);

				// skip setting.json
				if (item.name.match(new RegExp('setting.json', 'i'))) continue;

				// Ignore files that are not supported
				if (!FILE_TYPES[fileExt]) continue;

				const file: TDataTreeFile = {
					id: uuid(),
					title: item.name.replace(extname(item.name), ''),
					type: 'file',
					ext: fileExt,
					path: encodeURIComponent(item.name),
				};

				rootFiles.push(file);
			} else {
				const folder: TDataTreeFolder = {
					id: uuid(),
					title: item.name,
					type: 'folder',
					isOpen: false,
					leaf: [],
					path: encodeURIComponent(item.name),
				};

				// Get files inside the current sub folder
				const folderInfo = await readdirSync(resolve(staticFolderPath, item.name), { withFileTypes: true });

				for (const leaf of folderInfo) {
					const fileExt = extname(leaf.name).slice(1);

					// Ignore files that are not supported
					if (!FILE_TYPES[fileExt]) continue;

					const file: TDataTreeFile = {
						id: uuid(),
						title: leaf.name.replace(extname(leaf.name), ''),
						type: 'file',
						ext: fileExt,
						path: [encodeURIComponent(item.name), encodeURIComponent(leaf.name)].join('/'),
					};

					folder.leaf.push(file);
				}

				rootFolders.push(folder);
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

	const handleFolderClick = (id: string) => {
		const newData = projectTree.map((item) => {
			if (item.type === 'folder') {
				if (item.id === id) {
					return {
						...item,
						isOpen: !item.isOpen,
					};
				}

				return {
					...item,
					leaf: item.leaf.map((leaf) => {
						if (leaf.type === 'folder' && leaf.id === id) {
							return {
								...leaf,
								isOpen: !leaf.isOpen,
							};
						}

						return leaf;
					}),
				};
			}

			return item;
		});

		setProjectTree(newData);
	};

	const handleFileClick = (file: TDataTreeFile) => {
		setIframeFile(file);
	};

	const renderTree = (leaf: TDataTree[number]) => {
		if (leaf.type === 'folder') {
			return (
				<Folder key={leaf.id} isOpen={leaf.isOpen} leafLength={leaf.leaf.length}>
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

						{leaf.title}

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
					{leaf.title}.{leaf.ext}
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
			<Header data-container>
				<HeaderLogoContainer>
					<Image src={Logo} alt="The website logo" />
				</HeaderLogoContainer>

				<div data-user>
					<div>{user.name}</div>
					<div>|</div>
					<div>
						<a onClick={handleLogout} data-logout>
							<IoMdExit /> <span>Sair</span>
						</a>
					</div>
				</div>
			</Header>

			<MainContainer data-container>
				<SideBar>{projectTree.map((item) => renderTree(item))}</SideBar>

				<Content>{iframeFile && <iframe src={`/api/static/${props.project.id}/${iframeFile.path}`} />}</Content>
			</MainContainer>
		</>
	);
}
