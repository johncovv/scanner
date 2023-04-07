import { Container, CheckBox, Content } from "@/styles/components/CheckItem.style";

export interface TCheckItem {
	id: string;
	name: string;
	checked: boolean;
}

interface TCheckItemProps {
	data: TCheckItem;

	handles: {
		handleToggleItem?: (id: string) => void;
	};
}

export default function CheckItem(props: TCheckItemProps) {
	const { data, handles } = props;

	return (
		<Container onClick={() => handles.handleToggleItem?.(data.id)}>
			<CheckBox aria-checked={data.checked}>
				<span data-checkbox-icon />
			</CheckBox>

			<Content>{data.name}</Content>
		</Container>
	);
}
