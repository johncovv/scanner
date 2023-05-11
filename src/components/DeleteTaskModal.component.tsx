import { useToastMessages } from "@/context/toastMessages.context";
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
	const { addMessage, updateMessage } = useToastMessages();

	async function handleConfirm() {
		const { id } = addMessage({ type: "loading", message: "Excluindo tarefa..." });

		try {
			await TaskController.deleteTask({ projectId, taskId: task.id });
			onDelete?.(task.id);

			updateMessage(id, { type: "success", message: "Tarefa excluída com sucesso!" }, { delay: 300 });
		} catch (error: any) {
			updateMessage(id, { type: "error", message: error?.ptMessage || "Erro ao excluir tarefa!" });
		}
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
