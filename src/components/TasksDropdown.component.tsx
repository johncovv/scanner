import { IoMdClose, IoMdExit } from "react-icons/io";
import { useState } from "react";

import { HiPlusSmall } from "react-icons/hi2";
import { BiEditAlt } from "react-icons/bi";

import { DeleteTaskModal } from "@/components/DeleteTaskModal.component";
import { CheckList } from "@/components/core/CheckList.component";
import { CheckItem } from "@/components/core/CheckItem.component";
import { AddButton } from "@/styles/components/CheckList.style";
import { Dropdown } from "@/components/core/Dropdown.component";
import { TaskController } from "@/controllers/task.controller";
import { TaskModal } from "@/components/TaskModal.component";
import type { TProjectSetting } from "@/@types/project";
import type { TTask } from "@/@types/task";

interface IHeaderProps {
	project: TProjectSetting;
}

export function TasksDropdown({ project }: IHeaderProps) {
	const [tasks, setTasks] = useState<Array<TTask>>(project.tasks ?? []);

	async function handleCheckItemChange(task: TTask) {
		const { id: taskId, ...restTask } = task;
		const localUpdatedTask = { taskId, ...restTask, checked: !task.checked };

		const { updatedTask } = await TaskController.updateTask({ projectId: project.id, ...localUpdatedTask });
		setTasks((tasks) => tasks.map((t) => (t.id === task.id ? updatedTask : t)));
	}

	return (
		<>
			<div>|</div>

			<Dropdown>
				<CheckList>
					<>
						{tasks.map((task) => (
							<CheckItem key={task.id} data={task} onChange={() => handleCheckItemChange(task)}>
								<TaskModal
									projectId={project.id}
									task={task}
									trigger={<BiEditAlt style={{ marginRight: "0.15rem" }} />}
									onUpdate={(task) => {
										setTasks((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
									}}
								/>

								<DeleteTaskModal
									projectId={project.id}
									task={task}
									trigger={<IoMdClose color="#f5222d" size={16} />}
									onDelete={(taskId) => {
										setTasks((tasks) => tasks.filter((t) => t.id !== taskId));
									}}
								/>
							</CheckItem>
						))}

						<TaskModal
							projectId={project.id}
							trigger={
								<AddButton type="button">
									<HiPlusSmall data-icon size={16} /> Adicionar
								</AddButton>
							}
							onCreate={(task) => {
								setTasks((tasks) => [...tasks, task]);
							}}
						/>
					</>
				</CheckList>
			</Dropdown>

			<div>|</div>
		</>
	);
}
