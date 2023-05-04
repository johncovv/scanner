import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface IReactPortalProps {
	children: React.ReactNode;
	wrapperId?: string;
}

export function ReactPortal({ children, wrapperId = "portal-wrapper" }: IReactPortalProps) {
	const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

	function createWrapperElement(wrapperId: string) {
		const newElement = document.createElement("div");
		newElement.setAttribute("id", wrapperId);

		document.body.appendChild(newElement);

		return newElement;
	}

	useLayoutEffect(() => {
		let element = document.getElementById(wrapperId);

		if (!element) {
			element = createWrapperElement(wrapperId);
		}

		element.setAttribute("data-portal-wrapper", "true");
		setWrapper(element);

		return () => {
			if (element) element.remove();
		};
	}, [wrapperId]);

	if (!wrapper) return null;

	return createPortal(children, wrapper);
}
