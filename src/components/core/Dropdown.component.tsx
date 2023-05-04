import { BiChevronDown } from "react-icons/bi";
import React, { useState } from "react";

import { Container, Trigger, Content } from "@/styles/components/Dropdown.style";

interface TDropdownProps extends React.HTMLAttributes<HTMLElement> {
	trigger?: {
		triggerTitle?: string;
	} & React.HTMLAttributes<HTMLButtonElement>;
}

export function Dropdown({ children, trigger = {}, ...rest }: TDropdownProps) {
	const { triggerTitle = "Clique aqui", ...triggerProps } = trigger;

	const [isOpen, setIsOpen] = useState(false);

	function renderChildren(targetChildren: React.ReactNode) {
		return React.Children.map(targetChildren, (child) => {
			if (!React.isValidElement(child)) return null;

			return React.cloneElement(child, {
				...child.props,
				"data-dropdown-children": true,
			});
		});
	}

	function handleTriggerClick() {
		setIsOpen((prev) => !prev);
	}

	return (
		<Container {...rest} aria-expanded={isOpen}>
			<Trigger type="button" onClick={handleTriggerClick} {...triggerProps}>
				{triggerTitle} <BiChevronDown data-trigger-arrow size={20} />
			</Trigger>

			<Content>{children && renderChildren(children)}</Content>
		</Container>
	);
}
