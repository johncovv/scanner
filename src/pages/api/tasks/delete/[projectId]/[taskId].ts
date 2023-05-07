import { NextApiRequest, NextApiResponse } from "next/types";
import getConfig from "next/config";
import fs from "fs/promises";
import path from "path";

import { triggerProjectsUpdate } from "@api/projects/update";
import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";

export interface ITodoDeleteTaskDTO {
	projectId: string;
	taskId: string;
}

export default async function deleteTask(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "DELETE") {
		return res.status(405).send({ ok: false, error: "method not allowed" });
	}

	// get the data from the request body and validate it

	const { projectId, taskId } = req.query as Object as ITodoDeleteTaskDTO;

	if (!projectId) {
		return res.status(400).send({ ok: false, error: "The parameter 'projectId' was not provided!" });
	}

	if (!taskId) {
		return res.status(400).send({ ok: false, error: "The parameter 'taskId' was not provided!" });
	}

	// check if the project and task exists

	const { serverRuntimeConfig } = getConfig();
	const projectsList = <Array<TProjectSettingComplete>>serverRuntimeConfig.projectsList;

	const targetProject = projectsList.find((project) => project.id === projectId);

	if (!targetProject) {
		return res.status(404).send({ ok: false, error: "The project was not found!" });
	}

	const targetTask = targetProject.tasks?.find((ct) => ct.id === taskId);

	if (!targetTask) {
		return res.status(404).send({ ok: false, error: "The task was not found!" });
	}

	// remove the target task from the project tasks list

	const updatedProjectTasks = targetProject.tasks?.filter((task) => task.id !== taskId);

	const updatedProjectSettings = {
		...targetProject,
		tasks: updatedProjectTasks,
	};

	// save the updated project settings

	const projectPath = path.join(environment.staticDir, targetProject.folder_name, "setting.json");

	await fs.writeFile(projectPath, JSON.stringify(updatedProjectSettings, null, 2), "utf8");

	// update the cached projects list
	await triggerProjectsUpdate();

	return res.status(200).send({ ok: true });
}
