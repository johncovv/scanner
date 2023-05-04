import React from "react";

import { Container, CheckBox, Content } from "@/styles/components/CheckItem.style";

export interface TCheckItem {
	id: string;
	title: string;
	checked: boolean;
}

interface TCheckItemProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;

	data: TCheckItem;

	onChange?: () => void;
}

export function CheckItem({ data, children, onChange, ...rest }: TCheckItemProps) {
	return (
		<Container {...rest}>
			<CheckBox aria-checked={data.checked} onClick={onChange}>
				<span data-checkbox-icon />
			</CheckBox>

			<Content>
				<span data-title>{data.title}</span>

				<span data-actions>{children}</span>
			</Content>
		</Container>
	);
}
