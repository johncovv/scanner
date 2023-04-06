import { BiChevronDown } from "react-icons/bi";
import { BsFolder } from "react-icons/bs";

import { Folder, File, IconContainer } from "@/styles/components/Leaf.style";
import { TDataTree, TDataTreeFile } from "@/@types/tree";
import { FILE_TYPES } from "@/shared/file-tipes";

interface ILeafProps {
	leaf: TDataTree[number];
	fileIsSelected?: boolean;

	handles: {
		handleFolderClick: (id: string) => void;
		handleFileClick: (file: TDataTreeFile) => void;
	};
}

export function Leaf(props: ILeafProps) {
	const { handles, fileIsSelected } = props;

	const renderTree = (leafItem: TDataTree[number]) => {
		if (leafItem.type === "folder") {
			return (
				<Folder key={leafItem.id} isOpen={leafItem.isOpen} data-folder data-open={leafItem.isOpen}>
					<button
						className="folder__title"
						disabled={leafItem.leaf.length === 0}
						onClick={(e) => {
							e.stopPropagation();
							handles.handleFolderClick(leafItem.id);
						}}
					>
						<IconContainer>
							<BsFolder size={20} />
						</IconContainer>

						<span data-title>{leafItem.title}</span>

						<span className="arrow">
							<BiChevronDown size={20} />
						</span>
					</button>

					<div className="folder__container">
						<div className="folder__content">{leafItem.leaf.map((item: any) => renderTree(item))}</div>
					</div>
				</Folder>
			);
		} else {
			return (
				<File
					key={leafItem.id}
					onClick={(e) => {
						e.stopPropagation();
						handles.handleFileClick(leafItem);
					}}
					isSelected={fileIsSelected ?? false}
				>
					<IconContainer>
						{(() => {
							const Icon = FILE_TYPES[leafItem.ext];

							return <Icon size={20} />;
						})()}
					</IconContainer>

					<span data-title>{leafItem.title}</span>
					<span>.{leafItem.ext}</span>
				</File>
			);
		}
	};

	return renderTree(props.leaf);
}
