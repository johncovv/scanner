export type TDataTreeFile = {
	id: string;
	title: string;
	type: 'file';
	ext: string;
	path: string;
};

export type TDataTreeFolder = {
	id: string;
	title: string;
	type: 'folder';
	isOpen: boolean;
	leaf: TDataTree;
	path: string;
};

export type TDataTree = Array<TDataTreeFolder | TDataTreeFile>;
