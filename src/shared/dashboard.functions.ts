import { resolve, join, extname } from "path";
import { Dirent, readdirSync } from "fs";
import iconv from "iconv-lite";

import type { TDataTreeFolder, TDataTreeFile, TDataTree } from "@/@types/tree";
import { uuid } from "@/shared/functions/generate-uuid";
import { EAllowedFileTypes } from "@/@types/file-types";
import { TPublicUser } from "@/@types/iron-session";
import { FILE_TYPES } from "@/shared/file-tipes";

export type TDashboardProps = {
	user: Pick<TPublicUser, "username" | "name">;
	project: {
		id: string;
		name: string;
	};
	projectTree: TDataTree;
};

export async function handleFolder(item: Dirent, staticFolderPath: string, isSubFolder = false, parentPath = "") {
	// Create folder object

	const folder: TDataTreeFolder = {
		id: uuid(),
		title: item.name,
		type: "folder",
		isOpen: false,
		leaf: [],
		path: isSubFolder ? join(parentPath, encodeURIComponent(item.name)) : encodeURIComponent(item.name),
	};

	const parentPathDecoded = iconv.decode(Buffer.from(parentPath), "utf-8");
	const itemPathDecoded = iconv.decode(Buffer.from(item.name), "utf-8");

	const folderPath = isSubFolder
		? resolve(staticFolderPath, parentPathDecoded, itemPathDecoded)
		: resolve(staticFolderPath, itemPathDecoded);

	// Get all files and folders inside the current folder

	const folderInfo = await readdirSync(folderPath, { withFileTypes: true });

	for (const leaf of folderInfo) {
		if (leaf.isFile()) {
			const file = await handleFile(leaf, true, folder.path);
			if (file) folder.leaf.push(file);
		} else if (leaf.isDirectory()) {
			const subFolder = await handleFolder(leaf, staticFolderPath, true, join(parentPathDecoded, itemPathDecoded));
			if (subFolder) folder.leaf.push(subFolder);
		}
	}

	// Sort by folder first

	folder.leaf = folder.leaf.sort((a) => (a.type === "folder" ? -1 : 1));

	return folder;
}

export async function handleFile(item: Dirent, isOnSubFolder = false, parentPath = "") {
	const fileExt = extname(item.name).slice(1);

	// skip setting.json

	if (item.name.match(new RegExp("setting.json", "i"))) return;

	// Ignore files that are not supported

	if (!FILE_TYPES[fileExt]) return;

	// Create file object

	const file: TDataTreeFile = {
		id: uuid(),
		title: item.name.replace(extname(item.name), ""),
		type: "file",
		ext: fileExt as EAllowedFileTypes,
		path: isOnSubFolder ? join(parentPath, encodeURIComponent(item.name)) : encodeURIComponent(item.name),
	};

	return file;
}
