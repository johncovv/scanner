import { ITodoDeleteTaskDTO } from "@/pages/api/tasks/delete/[projectId]/[taskId]";
import { ITodoUpdateTaskDTO } from "@/pages/api/tasks/update";
import { ITodoAddTaskDTO } from "@/pages/api/tasks/create";

export class TaskController {
	public static async createTask(dto: ITodoAddTaskDTO) {
		const response = await fetch("/api/tasks/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dto),
		});

		return response.json();
	}

	public static async updateTask(dto: ITodoUpdateTaskDTO) {
		const response = await fetch("/api/tasks/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dto),
		});

		return response.json();
	}

	public static async deleteTask({ projectId, taskId }: ITodoDeleteTaskDTO) {
		const response = await fetch(`/api/tasks/delete/${projectId}/${taskId}`, {
			method: "DELETE",
		});

		return response.json();
	}
}
