import type { TDataTreeFolder, TDataTreeFile, TDataTree } from "@/@types/tree";

export function toggleFolder(id: string, tree: TDataTree): TDataTree {
	return tree.map((item) => {
		if (item.type === "folder") {
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
}
