import { EAllowedFileTypes } from "@/@types/file-types";

export type TDataTreeFile = {
	id: string;
	title: string;
	type: "file";
	ext: EAllowedFileTypes;
	path: string;
};

export type TDataTreeFolder = {
	id: string;
	title: string;
	type: "folder";
	isOpen: boolean;
	leaf: TDataTree;
	path: string;
};

export type TDataTree = Array<TDataTreeFolder | TDataTreeFile>;
