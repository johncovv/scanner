import { HiPlusSmall } from "react-icons/hi2";
import { useRef, useState } from "react";

import { Container, AddButton, Input } from "@/styles/components/CheckList.style";

import CheckItem, { TCheckItem } from "./CheckItem.component";

interface TCheckListProps extends React.HTMLAttributes<HTMLElement> {
	list: Array<TCheckItem>;
	allowAddMore?: boolean;

	updateList?: (newList: Array<TCheckItem>) => void;
}

export default function CheckList({ list, allowAddMore = false, updateList, ...rest }: TCheckListProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");

	function handleToggleItem(id: string) {
		const updatedItems = list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
		updateList?.(updatedItems);
	}

	function handleShowInput() {
		setTimeout(() => inputRef.current?.focus(), 100);
		setShowInput(true);
	}

	function handleHideInput() {
		setShowInput(false);
		setInputValue("");
	}

	function handleInputKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			if (!inputValue.length) return;

			const newItem = { id: `${list.length + 1}`, name: inputValue, checked: false };
			updateList?.([...list, newItem]);
			setInputValue("");
			setShowInput(false);
		}

		if (e.key === "Escape") {
			setShowInput(false);
			setInputValue("");
		}
	}

	return (
		<Container {...rest}>
			{list.map((item) => (
				<CheckItem key={item.id} data={item} handles={{ handleToggleItem }} />
			))}

			{allowAddMore && !showInput && (
				<AddButton type="button" onClick={handleShowInput}>
					<HiPlusSmall data-icon size={16} /> Adicionar
				</AddButton>
			)}

			{allowAddMore && showInput && (
				<Input
					ref={inputRef}
					type="text"
					value={inputValue}
					onKeyUp={handleInputKeyUp}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Escreva aqui..."
					onBlur={handleHideInput}
				/>
			)}
		</Container>
	);
}
