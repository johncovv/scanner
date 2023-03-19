export type TDataTreeFile = {
	id: string;
	title: string;
	type: 'file';
	ext: string;
};

export type TDataTreeFolder = {
	id: string;
	title: string;
	type: 'folder';
	isOpen: boolean;
	leaf: TDataTree;
};

export type TDataTree = Array<TDataTreeFolder | TDataTreeFile>;
