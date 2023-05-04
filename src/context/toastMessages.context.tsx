import { createContext, useContext, useState } from "react";

import { ToastPortal } from "@/components/core/ToastPortal.component";
import { IToastMessage } from "@/@types/toast-message";

type TToastMessagesContext = {
	messages: Array<IToastMessage>;
	addMessage: (message: Omit<IToastMessage, "id">) => void;
	removeMessage: (id: string) => void;
};

type TToastMessagesProviderProps = {
	children: React.ReactNode;
};

// create the context
const ToastMessagesContext = createContext<TToastMessagesContext>({} as TToastMessagesContext);

// create a custom provider
export const ToastMessagesProvider = ({ children }: TToastMessagesProviderProps) => {
	const [messages, setMessages] = useState<Array<IToastMessage>>([
		{
			id: "1",
			message: "This is a success message",
			type: "success",
		},
		{
			id: "2",
			message: "This is an error message",
			type: "error",
		},
		{
			id: "3",
			message: "This is a warning message! daçlj dlkjaslkdj salkj dlkas jdlkasj lkdas j",
			type: "warning",
		},
		{
			id: "4",
			message: "This is an info message",
			type: "info",
		},
		{
			id: "5",
			message: "This is a loading message",
			type: "loading",
		},
	]);

	const addMessage = (message: Omit<IToastMessage, "id">) => {
		const id = Math.random().toString(36).substr(2, 9);

		setMessages((prev) => [...prev, { ...message, id }]);
	};

	const removeMessage = (id: string) => {
		setMessages((prev) => prev.filter((message) => message.id !== id));
	};

	return (
		<ToastMessagesContext.Provider value={{ messages, addMessage, removeMessage }}>
			<ToastPortal messages={messages} />

			{children}
		</ToastMessagesContext.Provider>
	);
};

// create a custom hook
export const useToastMessages = () => useContext(ToastMessagesContext);
