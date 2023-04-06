import readXlsxFile, { Row } from "read-excel-file";
import { TDataTreeFile } from "@/@types/tree";

export type TData = Array<Array<{ value: Row[number] }>> | null;

export async function readExcelFile(projectId: string, file: TDataTreeFile): Promise<TData> {
	try {
		const targetFile = await fetch(`/api/static/${projectId}/${file.path}`);

		const buffer = await targetFile.arrayBuffer();

		const rows = await readXlsxFile(buffer);

		return rows.map((row) => row.map((cell) => ({ value: cell })));
	} catch (error) {
		throw new Error("Error reading file");
	}
}
