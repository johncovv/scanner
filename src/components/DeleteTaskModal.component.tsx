import { TaskController } from "@/controllers/task.controller";
import { Modal } from "@/components/core/Modal.component";
import { TTask } from "@/@types/task";

type TDeleteTaskModalProps = {
	trigger: React.ReactNode;

	projectId: string;
	task: TTask;

	onDelete?: (taskId: string) => void;
};

export function DeleteTaskModal({ projectId, task, trigger, onDelete }: TDeleteTaskModalProps) {
	async function handleConfirm() {
		await TaskController.deleteTask({ projectId, taskId: task.id });
		onDelete?.(task.id);
	}

	return (
		<Modal
			trigger={trigger}
			footer={{
				confirmText: "Excluir tarefa",
				onConfirm: handleConfirm,
			}}
		>
			Realmente deseja excluir a tarefa <strong>{task.title}</strong>?
		</Modal>
	);
}
