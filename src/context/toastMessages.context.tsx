import { createContext, useContext, useState } from "react";

import { ToastPortal } from "@/components/core/ToastPortal.component";
import { uuid } from "@/shared/functions/generate-uuid";
import { IToastMessage } from "@/@types/toast-message";
import { sleep } from "@/shared/utils/sleep";

type TToastMessagesContext = {
	messages: Array<IToastMessage>;
	addMessage: (message: Omit<IToastMessage, "id">) => IToastMessage;
	removeMessage: (id: string) => void;

	updateMessage: (
		id: string,
		message: Omit<IToastMessage, "id">,
		configs?: { delay?: number }
	) => Promise<IToastMessage>;
};

type TToastMessagesProviderProps = {
	children: React.ReactNode;
};

// create the context
const ToastMessagesContext = createContext<TToastMessagesContext>({} as TToastMessagesContext);

// create a custom provider
export const ToastMessagesProvider = ({ children }: TToastMessagesProviderProps) => {
	const [messages, setMessages] = useState<Array<IToastMessage>>([]);
	const [timers, setTimers] = useState<Array<{ [key: string]: NodeJS.Timeout }>>([]);

	function removeTimer(id: string) {
		const timer = timers.find((timer) => timer[id]);
		if (timer) clearTimeout(timer[id]);

		setTimers((prev) => prev.filter((timer) => !timer[id]));
	}

	function addTimer(message: IToastMessage) {
		if (message.type === "loading") return;
		if (message.duration === "infinite") return;

		const timer = setTimeout(() => {
			removeMessage(message.id);
		}, message.duration ?? 3000);

		setTimers((prev) => [...prev, { [message.id]: timer }]);
	}

	function addMessage(message: Omit<IToastMessage, "id">): IToastMessage {
		const id = uuid();

		const newMessage = { ...message, id };

		if (message.type === "loading") {
			newMessage.duration = "infinite";
		}

		setMessages((prev) => [...prev, newMessage]);
		addTimer(newMessage);

		return newMessage;
	}

	function removeMessage(id: string): void {
		setMessages((prev) => prev.filter((message) => message.id !== id));
	}

	async function updateMessage(
		id: string,
		message: Omit<IToastMessage, "id">,
		configs?: { delay?: number }
	): Promise<IToastMessage> {
		if (configs?.delay) await sleep(configs.delay);

		return new Promise<IToastMessage>((resolve) => {
			setMessages((prev) => {
				// find the target message
				const targetMessage = prev.find((message) => message.id === id);
				if (!targetMessage) return prev;

				// update the message
				const updatedMessage = Object.assign({}, targetMessage, { duration: undefined }, message);
				const updatedList = prev.map((message) => (message.id === id ? updatedMessage : message));

				// resolve the promise with the updated message
				resolve(updatedMessage);

				// handle the timer
				removeTimer(id);
				addTimer(updatedMessage);

				// return the updated list
				return updatedList;
			});
		});
	}

	return (
		<ToastMessagesContext.Provider value={{ messages, addMessage, removeMessage, updateMessage }}>
			<ToastPortal messages={messages} />

			{children}
		</ToastMessagesContext.Provider>
	);
};

// create a custom hook
export const useToastMessages = () => useContext(ToastMessagesContext);
