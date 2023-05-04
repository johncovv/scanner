import { useState } from "react";

import { ToastMessage } from "@/components/core/ToastMessage.component";
import { ReactPortal } from "@/components/core/ReactPortal.component";
import { Container } from "@/styles/components/ToastPortal.style";
import { IToastMessage } from "@/@types/toast-message.d";

type TToastPortalProps = {
	messages: Array<IToastMessage>;
};

export const ToastPortal = ({ messages }: TToastPortalProps) => {
	return (
		<ReactPortal wrapperId="toast-portal">
			<Container>
				{messages.map((message) => (
					<ToastMessage key={message.id} data={message} />
				))}
			</Container>
		</ReactPortal>
	);
};
