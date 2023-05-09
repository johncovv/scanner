import { NextApiRequest, NextApiResponse } from "next/types";
import getConfig from "next/config";
import fs from "fs/promises";
import path from "path";

import { FuncMethodLimiter } from "@/shared/decorators/methods.decorator";
import { triggerProjectsUpdate } from "@api/projects/update";
import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";
import { TTask } from "@/@types/task";

export interface ITodoUpdateTaskDTO extends Omit<TTask, "id"> {
	projectId: string;
	taskId: string;
}

export default FuncMethodLimiter("PUT")(async function (req: NextApiRequest, res: NextApiResponse) {
	// get the data from the request body and validate it

	const { projectId, taskId, ...task }: ITodoUpdateTaskDTO = req.body;

	if (!projectId) {
		return res.status(400).send({
			ok: false,
			message: "The parameter 'projectId' was not provided!",
			ptMessage: "O parâmetro 'identificador do projeto' não foi fornecido!",
		});
	}

	if (!taskId) {
		return res.status(400).send({
			ok: false,
			message: "The parameter 'taskId' was not provided!",
			ptMessage: "O parâmetro 'identificador da tarefa' não foi fornecido!",
		});
	}

	// check if the project and task exists

	const { serverRuntimeConfig } = getConfig();
	const projectsList = <Array<TProjectSettingComplete>>serverRuntimeConfig.projectsList;

	const targetProject = projectsList.find((project) => project.id === projectId);

	if (!targetProject) {
		return res.status(404).send({
			ok: false,
			message: "The project was not found!",
			ptMessage: "O projeto não foi encontrado!",
		});
	}

	const targetTask = targetProject.tasks?.find((ct) => ct.id === taskId);

	if (!targetTask) {
		return res.status(404).send({
			ok: false,
			message: "The task was not found!",
			ptMessage: "A tarefa não foi encontrada!",
		});
	}

	// update the target task using the provided data

	const updatedTask: TTask = {
		...targetTask,
		...task,
		updatedAt: new Date(),
	};

	// update the project tasks list

	const updatedProjectTasks = targetProject.tasks?.map((ct) => (ct.id === taskId ? updatedTask : ct));

	const updatedProjectSettings = {
		...targetProject,
		tasks: updatedProjectTasks,
	};

	// save the updated project settings

	const projectPath = path.join(environment.staticDir, targetProject.folder_name, "setting.json");

	await fs.writeFile(projectPath, JSON.stringify(updatedProjectSettings, null, 2), "utf8");

	// update the cached projects list
	await triggerProjectsUpdate();

	return res.status(200).send({ ok: true, updatedTask });
});
