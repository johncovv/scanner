const { faker } = require("@faker-js/faker");
const { v4: uuid } = require("uuid");
const fs = require("fs");

async function startup() {
	const projectsList = await fs.promises.readdir("./static", { withFileTypes: true });

	const validFolders = [];

	for (const project of projectsList) {
		if (!project.isDirectory()) continue;

		try {
			// getting the project setting file

			let settingFile = null;

			try {
				settingFile = await fs.promises.readFile(`./static/${project.name}/setting.json`, "utf8");
			} catch (error) {
				const newSetting = {
					id: uuid(),
					name: project.name,

					owner: {
						name: "Owner",
						username: faker.internet.userName(),
						password: faker.internet.password(),
					},
				};

				const stringifiedSetting = JSON.stringify(newSetting, null, 2);
				await fs.promises.writeFile(`./static/${project.name}/setting.json`, stringifiedSetting, "utf8");

				settingFile = stringifiedSetting;
			}

			const setting = JSON.parse(settingFile);
			if (!setting.owner?.username || !setting.owner?.password || !setting.name) continue;

			// if the setting file doesn't have an id then create one and save it to the file

			if (!setting.id) {
				setting.id = uuid();

				await fs.promises.writeFile(`./static/${project.name}/setting.json`, JSON.stringify(setting, null, 2), "utf8");
			}

			// if the project settings is valid then push it to the validFiles array

			validFolders.push({ ...setting, folder_name: project.name });

			console.info(`✅ "${setting.name}" was successfully registered!`);
		} catch (error) {
			continue;
		}
	}

	return validFolders;
}

module.exports = { startup };
