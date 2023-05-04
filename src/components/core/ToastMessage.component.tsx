import { useEffect, useState } from "react";

import { IoAlertCircleSharp, IoCheckmarkCircleSharp, IoCloseCircle, IoInformationCircle } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";

import { Container, MessageBody } from "@/styles/components/ToastMessage.style";
import { IToastMessage } from "@/@types/toast-message";

type TMessageProps = {
	data: IToastMessage;
	onClose?: (id: string) => void;
};

export const ToastMessage = ({ data, onClose }: TMessageProps) => {
	const { id, message, type } = data;

	function renderIcon(type: IToastMessage["type"]) {
		switch (type) {
			case "success":
				return <IoCheckmarkCircleSharp size={20} color="#52c41a" />;
			case "error":
				return <IoCloseCircle size={20} color="#ff4d4f" />;
			case "warning":
				return <IoAlertCircleSharp size={20} color="#faad14" />;
			case "info":
				return <IoInformationCircle size={20} color="#1677ff" />;
			case "loading":
				return <AiOutlineLoading size={20} color="#1677ff" />;
		}
	}

	return (
		<Container data-type={type}>
			{renderIcon(type)}

			<MessageBody>{message}</MessageBody>
		</Container>
	);
};
