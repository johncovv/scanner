import type { NextApiRequest, NextApiResponse } from 'next';
import { statSync, createReadStream } from 'fs';
import { resolve } from 'path';
import * as mime from 'mime';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { projectId, filePath } = req.query as { projectId: string; filePath: string[] };

	// getting file path

	const staticFolderPath = resolve(process.cwd(), 'static', projectId, ...filePath);

	// getting file stats and mime type

	const stat = statSync(staticFolderPath);
	const mimeType = mime.getType(staticFolderPath)!;

	// setting headers

	const fileName = filePath[filePath.length - 1];

	res.writeHead(200, {
		'Content-Type': mimeType,
		'Content-Disposition': `inline; filename=${fileName}`,
		'Content-Length': stat.size,
	});

	// piping file to response

	const readStream = createReadStream(staticFolderPath);
	readStream.pipe(res);
}
