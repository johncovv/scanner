import { useState } from "react";

import { Container, Input, TextArea } from "@/styles/components/TaskModal.style";
import { TaskController } from "@/controllers/task.controller";
import { Modal } from "@/components/core/Modal.component";
import type { TTask } from "@/@types/task";

type TTaskModalProps = {
	trigger: React.ReactNode;

	projectId: string;
	task?: TTask;

	onCreate?: (task: TTask) => void;
	onUpdate?: (task: TTask) => void;
};

export function TaskModal({ projectId, task, trigger, ...props }: TTaskModalProps) {
	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");

	async function createTask() {
		const { createdTask } = await TaskController.createTask({ projectId, title, description });
		props.onCreate?.(createdTask);
	}

	async function updateTask() {
		if (!task) return;

		const { id: taskId, ...restTask } = task;

		const localUpdatedTask = {
			...restTask,
			taskId,
			title,
			description,
		};

		const { updatedTask } = await TaskController.updateTask({ projectId, ...localUpdatedTask });
		props.onUpdate?.(updatedTask);
	}

	async function handleConfirm() {
		if (task) {
			await updateTask();
		} else {
			await createTask();
		}
	}

	return (
		<Modal
			title={task?.title ? `Editar "${task?.title}"` : "Criar task"}
			trigger={trigger}
			footer={{
				confirmText: task != null ? "Atualizar tarefa" : "Criar tarefa",
				onConfirm: handleConfirm,
			}}
		>
			<Container>
				<Input
					type="text"
					placeholder="Digite o título aqui..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<TextArea
					placeholder="Digite a descrição aqui..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={10}
				/>
			</Container>
		</Modal>
	);
}
