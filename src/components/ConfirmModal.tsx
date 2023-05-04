import { Modal } from "@/components/core/Modal.component";

export type TConfirmModalProps = {
	children?: React.ReactNode;

	title: string;
	message: string;

	onConfirm: () => void;
	onCancel?: () => void;
};

export function ConfirmModal({ children, ...props }: TConfirmModalProps) {
	return (
		<Modal
			title={props.title}
			footer={{
				onConfirm: props.onConfirm,
				onCancel: props.onCancel,
			}}
			trigger={children}
		>
			{props.message}
		</Modal>
	);
}
