import { HiPlusSmall } from "react-icons/hi2";
import { useRef, useState } from "react";

import { Container } from "@/styles/components/CheckList.style";

interface TCheckListProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;
}

export function CheckList({ children, ...rest }: TCheckListProps) {
	return <Container {...rest}>{children}</Container>;
}
