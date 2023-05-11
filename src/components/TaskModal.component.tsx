import { useCallback, useEffect, useState } from "react";

import { Container, Input, TextArea } from "@/styles/components/TaskModal.style";
import { TaskController } from "@/controllers/task.controller";
import { Modal } from "@/components/core/Modal.component";
import type { TTask } from "@/@types/task";
import { useToastMessages } from "@/context/toastMessages.context";

type TTaskModalProps = {
	trigger: React.ReactNode;

	projectId: string;
	task?: TTask;

	onCreate?: (task: TTask) => void;
	onUpdate?: (task: TTask) => void;
};

export function TaskModal({ projectId, task, trigger, ...props }: TTaskModalProps) {
	const { addMessage, updateMessage } = useToastMessages();

	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");

	async function createTask() {
		const { id } = addMessage({ type: "loading", message: "Criando tarefa..." });

		try {
			const { createdTask } = await TaskController.createTask({ projectId, title, description });
			props.onCreate?.(createdTask);

			updateMessage(id, { type: "success", message: "Tarefa criada com sucesso!" }, { delay: 300 });
		} catch (error: any) {
			updateMessage(id, { type: "error", message: error?.ptMessage || "Erro ao criar tarefa!" });
		}
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

		const { id } = addMessage({ type: "loading", message: "Atualizando tarefa..." });

		try {
			const { updatedTask } = await TaskController.updateTask({ projectId, ...localUpdatedTask });
			props.onUpdate?.(updatedTask);

			updateMessage(id, { type: "success", message: "Tarefa atualizada com sucesso!" }, { delay: 300 });
		} catch (error: any) {
			updateMessage(id, { type: "error", message: error?.ptMessage || "Erro ao atualizar tarefa!" });
		}
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
