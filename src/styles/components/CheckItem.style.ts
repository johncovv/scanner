import styled, { css } from "styled-components";

export const CheckboxHover = css`
	background-color: #e5e5e5;
	box-shadow: 0 0 0 2px var(--tertiary-color);
`;

export const Container = styled.li`
	flex-direction: row;
	display: flex;
	align-items: center;

	&:not(:last-of-type) {
		margin-bottom: 0.5rem;
	}

	&:hover {
		[data-checkbox] {
			${CheckboxHover}
		}
	}
`;

export const CheckBox = styled.span`
	background-color: #f5f5f5;
	display: flex;
	height: 15px;
	width: 15px;
	justify-content: center;
	align-items: center;
	cursor: pointer;

	margin-right: 0.5rem;
	border-radius: 3px;
	border: 1px solid var(--secondary-color);

	&:hover {
		${CheckboxHover}
	}

	[data-checkbox-icon] {
		background-color: var(--secondary-color);
		border-radius: 3px;
		display: none;
		width: 100%;
		height: 100%;
	}

	&[aria-checked="true"] {
		padding: 1px;

		[data-checkbox-icon] {
			display: block;
		}
	}
`;

export const Content = styled.div`
	display: flex;
	width: calc(100% - (15px + 8px));

	span[data-title] {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		flex: 1;
	}

	[data-actions] {
		cursor: pointer;
	}
`;
