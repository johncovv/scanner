import { BsFolder, BsFiletypePdf } from 'react-icons/bs';
import { BiChevronDown } from 'react-icons/bi';

import style from '@/styles/Dashboard.module.css';
import { useState } from 'react';

export default function User() {
	const [data, setData] = useState([
		{
			id: 'folder_1',
			title: 'Projeto 1',
			type: 'folder',
			isOpen: true,
			leaf: [
				{
					title: 'Subprojeto 1',
					type: 'file',
					ext: 'pdf',
				},
				{
					title: 'Subprojeto 2',
					type: 'file',
					ext: 'pdf',
				},

				{
					id: 'subfolder_3',
					title: 'Subprojeto 3',
					type: 'folder',
					isOpen: false,
					leaf: [
						{
							title: 'Subprojeto 3.1',
							type: 'file',
							ext: 'pdf',
						},
					],
				},
			],
		},
	]);

	const handleFolderClick = (id: string) => {
		const newData = data.map((item) => {
			if (item.id === id) {
				return {
					...item,
					isOpen: !item.isOpen,
				};
			} else {
				return {
					...item,
					leaf: item.leaf.map((leaf) => {
						if (leaf.id === id) {
							return {
								...leaf,
								isOpen: !leaf.isOpen,
							};
						} else {
							return leaf;
						}
					}),
				};
			}
		});

		setData(newData);
	};

	const renderTree = (leaf: any) => {
		if (leaf.type === 'folder') {
			return (
				<div key={leaf.id} className={style.sidebar__folder}>
					<button
						className={style.sidebar__folder_title}
						onClick={(e) => {
							e.stopPropagation();
							handleFolderClick(leaf.id);
						}}
					>
						<span className={style.sidebar__item_icon}>
							<BsFolder size={20} />
						</span>

						{leaf.title}

						<span className={style.sidebar__folder_arrow}>
							<BiChevronDown size={20} />
						</span>
					</button>

					<div className={style.sidebar__folder_container}>
						<div className={`${leaf.isOpen ? style.sidebar__folder_content : style.sidebar__folder_content_hidden}`}>
							{leaf.leaf.map((item: any) => renderTree(item))}
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<button
					key={leaf.id}
					className={style.sidebar__file}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<span className={style.sidebar__item_icon}>
						<BsFiletypePdf size={20} />
					</span>
					{leaf.title}.{leaf.ext}
				</button>
			);
		}
	};

	return (
		<>
			<header className={style.header}>
				<div>Logo</div>

				<div>User</div>
			</header>

			<main className={style.main}>
				<div className={style.sidebar}>{data.map((item) => renderTree(item))}</div>

				<div className={style.content}></div>
			</main>
		</>
	);
}
