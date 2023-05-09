import { NextApiRequest, NextApiResponse } from "next/types";
import getConfig from "next/config";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

import { FuncMethodLimiter } from "@/shared/decorators/methods.decorator";
import { triggerProjectsUpdate } from "@api/projects/update";
import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";
import { TTask } from "@/@types/task";

export interface ITodoAddTaskDTO {
	projectId: string;
	title: string;
	description: string;
}

export default FuncMethodLimiter("POST")(async function (req: NextApiRequest, res: NextApiResponse) {
	// get the data from the request body and validate it

	const { projectId, title, description }: ITodoAddTaskDTO = req.body;

	if (!projectId) {
		return res.status(400).send({
			ok: false,
			message: "The parameter 'projectId' was not provided!",
			ptMessage: "O parâmetro 'identificador do projeto' não foi fornecido!",
		});
	}

	if (!title) {
		return res.status(400).send({
			ok: false,
			message: "The parameter 'title' was not provided!",
			ptMessage: "O parâmetro 'título' não foi fornecido!",
		});
	}

	// check if the project exists

	const { serverRuntimeConfig } = getConfig();
	const projectsList = <Array<TProjectSettingComplete>>serverRuntimeConfig.projectsList;

	const targetProject = projectsList.find((project) => project.id === projectId);

	if (!targetProject) {
		return res.status(400).send({
			ok: false,
			message: "The project was not found!",
			ptMessage: "O projeto não foi encontrado!",
		});
	}

	// create the new task

	const newTask: TTask = {
		id: uuid(),
		title,
		description,
		checked: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const updatedTasks = [...(targetProject.tasks ?? []), newTask];

	// update the project tasks list

	const updatedProjectSettings = {
		...targetProject,
		tasks: updatedTasks,
	};

	const projectPath = path.join(environment.staticDir, targetProject.folder_name, "setting.json");

	// write the updated project settings to the file

	await fs.writeFile(projectPath, JSON.stringify(updatedProjectSettings, null, 2), "utf8");

	// update the cached projects list
	await triggerProjectsUpdate();

	return res.status(200).send({ ok: true, createdTask: newTask });
});
