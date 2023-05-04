import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

import { triggerProjectsUpdate } from "@api/projects/update";
import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";
import { TTask } from "@/@types/task";

export interface ITodoAddTaskDTO {
	projectId: string;
	title: string;
	description: string;
}

export default withIronSessionApiRoute(
	async function createTask(req: NextApiRequest, res: NextApiResponse) {
		if (req.method !== "POST") {
			return res.status(405).send({ ok: false, error: "method not allowed" });
		}

		// get the data from the request body and validate it

		const { projectId, title, description }: ITodoAddTaskDTO = req.body;

		if (!projectId) {
			return res.status(400).send({ ok: false, error: "The parameter 'projectId' was not provided!" });
		}

		if (!title) {
			return res.status(400).send({ ok: false, error: "The parameter 'title' was not provided!" });
		}

		// check if the project exists

		const { serverRuntimeConfig } = getConfig();
		const projectsList = <Array<TProjectSettingComplete>>serverRuntimeConfig.projectsList;

		const targetProject = projectsList.find((project) => project.id === projectId);

		if (!targetProject) {
			return res.status(400).send({ ok: false, error: "The project was not found!" });
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
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	}
);
