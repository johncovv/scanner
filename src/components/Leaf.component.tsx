import { BiChevronDown } from "react-icons/bi";
import { BsFolder } from "react-icons/bs";

import {
	Folder,
	FolderTrigger,
	FolderContainer,
	FolderContent,
	File,
	IconContainer,
} from "@/styles/components/Leaf.style";
import { TDataTree, TDataTreeFile, TDataTreeFolder } from "@/@types/tree";
import { FILE_TYPES } from "@/shared/utils/file-tipes";

interface ILeafProps {
	leaf: TDataTree[number];
	selectedFileId?: string;

	handles: {
		handleFolderClick: (id: string) => void;
		handleFileClick: (file: TDataTreeFile) => void;
	};
}

export function Leaf(props: ILeafProps) {
	const { handles, selectedFileId } = props;

	function renderFile(file: TDataTreeFile) {
		return (
			<File
				key={file.id}
				onClick={(e) => {
					e.stopPropagation();
					handles.handleFileClick(file);
				}}
				data-file
				data-file-selected={selectedFileId === file.id}
			>
				<IconContainer>
					{(() => {
						const Icon = FILE_TYPES[file.ext];

						return <Icon size={20} />;
					})()}
				</IconContainer>

				<span data-title>{file.title}</span>
				<span>.{file.ext}</span>
			</File>
		);
	}

	function renderFolder(folder: TDataTreeFolder) {
		return (
			<Folder key={folder.id} data-folder aria-expanded={folder.isOpen}>
				<FolderTrigger
					disabled={folder.leaf.length === 0}
					onClick={(e) => {
						e.stopPropagation();
						handles.handleFolderClick(folder.id);
					}}
				>
					<IconContainer>
						<BsFolder size={20} />
					</IconContainer>

					<span data-title>{folder.title}</span>

					<span data-folder-arrow>
						<BiChevronDown size={20} />
					</span>
				</FolderTrigger>

				<FolderContainer>
					<FolderContent>
						{folder.leaf.map((left) => {
							return renderTree(left);
						})}
					</FolderContent>
				</FolderContainer>
			</Folder>
		);
	}

	const renderTree = (leafItem: TDataTree[number]) => {
		if (leafItem.type === "folder") {
			return renderFolder(leafItem);
		} else {
			return renderFile(leafItem);
		}
	};

	return renderTree(props.leaf);
}
