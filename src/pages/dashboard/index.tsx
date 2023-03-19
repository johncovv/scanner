import { GetServerSidePropsContext } from 'next';
import { resolve, extname } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { useState } from 'react';

import { BiChevronDown } from 'react-icons/bi';
import { BsFolder } from 'react-icons/bs';

import type { TDataTree, TDataTreeFolder, TDataTreeFile } from '@/modules/tree';
import type { TProjectSetting } from '@/modules/project';
import { FILE_TYPES } from '@/shared/file-tipes';
import { uuidv4 } from '@/shared/generate-uuid';

import { Header, MainContainer, SideBar, Content, Folder, File, IconContainer } from './styles';

type TProps = {
	user: {
		name: string;
		email: string;
	};
	setting: {
		name: string;
	};
	projectId: string;
	projectTree: TDataTree;
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<{ props: TProps }> => {
	const user = {
		name: 'John Doe',
		email: 'john.doe@mail.com',

		projectId: 'project-123',
	};

	const staticFolderPath = resolve(process.cwd(), 'static', user.projectId);
	const directoryInfo = await readdirSync(staticFolderPath, { withFileTypes: true });

	let setting!: TProjectSetting;
	let rootFolders: Array<TDataTreeFolder> = [];
	let rootFiles: Array<TDataTreeFile> = [];

	for (const item of directoryInfo) {
		if (item.isFile()) {
			const fileExt = extname(item.name).slice(1);

			// Get the project setting
			if (item.name.match(new RegExp('setting.json', 'i'))) {
				const settingContent = await readFileSync(resolve(staticFolderPath, 'setting.json'), 'utf-8');
				setting = JSON.parse(settingContent);
			}

			// Ignore files that are not supported
			if (!FILE_TYPES[fileExt]) continue;

			const file: TDataTreeFile = {
				id: uuidv4(),
				title: item.name.replace(extname(item.name), ''),
				type: 'file',
				ext: fileExt,
				path: resolve(staticFolderPath, item.name),
			};

			rootFiles.push(file);
		} else {
			const folder: TDataTreeFolder = {
				id: uuidv4(),
				title: item.name,
				type: 'folder',
				isOpen: false,
				leaf: [],
				path: resolve(staticFolderPath, item.name),
			};

			// Get files inside the current sub folder
			const folderInfo = await readdirSync(resolve(staticFolderPath, item.name), { withFileTypes: true });

			for (const leaf of folderInfo) {
				const fileExt = extname(leaf.name).slice(1);

				// Ignore files that are not supported
				if (!FILE_TYPES[fileExt]) continue;

				const file: TDataTreeFile = {
					id: uuidv4(),
					title: leaf.name.replace(extname(leaf.name), ''),
					type: 'file',
					ext: fileExt,
					path: resolve(staticFolderPath, item.name, leaf.name),
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
			user,
			setting,
			projectId: user.projectId,
			projectTree: [...rootFolders, ...rootFiles],
		},
	};
};

export default function Dashboard(props: TProps) {
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

	return (
		<>
			<Header>
				<div>Logo</div>

				<div>
					<strong>{user.name}</strong>
				</div>
			</Header>

			<MainContainer>
				<SideBar>{projectTree.map((item) => renderTree(item))}</SideBar>

				<Content>
					{iframeFile && (
						<iframe src={`/api/static/${encodeURIComponent(props.projectId)}/${encodeURIComponent(iframeFile.path)}`} />
					)}
				</Content>
			</MainContainer>
		</>
	);
}
