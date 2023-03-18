import { useCallback, useState } from 'react';
import { readdirSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';
import { GetServerSidePropsContext } from 'next';

type TQuery = {
	projectId: string;
};

type TFile = {
	name: string;
	ext: string;
};

type TProps = {
	projectId: string;
	setting: {
		name: string;
	};
	files: Array<TFile>;
};

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: TProps }> {
	const { projectId } = context.query as TQuery;

	const staticFolderPath = resolve(process.cwd(), 'static', projectId);
	const filesList = await readdirSync(staticFolderPath, { withFileTypes: true });

	const files = [];
	let setting = { name: '---' };

	for (const { name: fileName } of filesList) {
		const file = {
			name: fileName.slice(0, -extname(fileName).length),
			ext: extname(fileName).slice(1),
		};

		const isSettingFile = file.name === 'setting' && file.ext === 'json';

		if (isSettingFile) {
			const fileContent = readFileSync(resolve(staticFolderPath, fileName), 'utf8');
			const content = JSON.parse(fileContent);

			delete content.passport;

			if (fileContent) setting = content;
			continue;
		}

		files.push(file);
	}

	return {
		props: {
			files,
			projectId,
			setting,
		},
	};
}

export default function ProjectPage(props: TProps) {
	const [iframeSrc, setIframeSrc] = useState<string | null>(null);

	const handleFileClick = useCallback((file: TFile) => {
		const fileName = encodeURIComponent(`${file.name}.${file.ext}`);

		setIframeSrc(`/api/static/${props.projectId}/${fileName}`);
	}, []);

	return (
		<div>
			<h1>{props.setting.name}</h1>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{props.files.map(({ name, ext }) => (
					<button type="button" key={name} onClick={() => handleFileClick({ name, ext })}>
						{name}.{ext}
					</button>
				))}
			</div>

			<hr />

			{iframeSrc && <iframe src={iframeSrc} style={{ width: '100%', height: '80vh' }} />}
		</div>
	);
}
