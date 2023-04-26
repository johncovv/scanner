import type { NextApiRequest, NextApiResponse } from "next";
import { statSync, createReadStream } from "fs";
import getConfig from "next/config";
import { resolve } from "path";
import * as mime from "mime";

import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { projectId, filePath } = req.query as { projectId: string; filePath: string[] };

	// get next config

	const { serverRuntimeConfig } = getConfig();
	const { projectsList } = serverRuntimeConfig as { projectsList: Array<TProjectSettingComplete> };

	const targetProject = projectsList.find((project) => project.id === projectId);

	if (!targetProject) {
		return res.status(404).send({ ok: false, error: "project not found" });
	}

	// getting file path

	const staticFolderPath = resolve(environment.staticDir, targetProject.folder_name, ...filePath);

	// getting file stats and mime type

	const stat = statSync(staticFolderPath);
	const mimeType = mime.getType(staticFolderPath)!;

	// setting headers

	const fileName = filePath[filePath.length - 1];

	res.writeHead(200, {
		"Content-Type": mimeType,
		"Content-Disposition": `inline; filename=${fileName}`,
		"Content-Length": stat.size,
	});

	// piping file to response

	const readStream = createReadStream(staticFolderPath);
	readStream.pipe(res);
}
