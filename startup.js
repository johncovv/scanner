const { v4: uuid } = require('uuid');
const fs = require('fs');

async function startup() {
	const projectsList = await fs.promises.readdir('./static', { withFileTypes: true });

	const validFiles = [];

	for (const project of projectsList) {
		if (!project.isDirectory()) continue;

		try {
			// getting the project setting file

			const settingFile = await fs.promises.readFile(`./static/${project.name}/setting.json`, 'utf8');
			const setting = JSON.parse(settingFile);
			if (!setting.owner?.email || !setting.owner?.password || !setting.name) continue;

			// setting the project id

			setting.id = uuid();

			// if the project settings is valid then push it to the validFiles array

			validFiles.push({ ...setting, folder_name: project.name });
		} catch (error) {
			continue;
		}
	}

	return validFiles;
}

module.exports = { startup };
