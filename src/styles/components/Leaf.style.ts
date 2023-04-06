import styled, { css } from "styled-components";

type FolderProps = {
	isOpen: boolean;
};

export const Folder = styled.div<FolderProps>`
	& .folder__title {
		position: relative;
		background-color: #24a8e0;
		color: #fff;
		padding: 1rem;
		padding-left: 3rem;
		border-radius: 5px;
		width: 100%;
		border: none;
		cursor: pointer;
		margin-top: 0.5rem;

		display: flex;
		justify-content: space-between;

		& > span[data-title] {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: fit-content;
			margin-right: 1.5rem;
		}

		transition: background-color 100ms ease-in-out;
		&:hover {
			background-color: #166eae;
		}

		&[disabled] {
			pointer-events: none;
			background-color: #595959;
			opacity: 0.5;

			& .arrow {
				display: none;
			}
		}

		& .arrow {
			position: absolute;
			right: 1rem;
			top: 25%;
			transition: transform 200ms ease-in-out;
			transform: ${({ isOpen }) => (isOpen ? "rotateX(0)" : "rotateX(180deg) !important")};
		}
	}

	& .folder__container {
		position: relative;
		padding-left: 1rem;

		&::before {
			content: "";
			display: ${({ isOpen }) => (isOpen ? "block" : "none !important")};

			position: absolute;
			top: 0.5rem;
			left: 0;
			bottom: 0;
			border: 1px dashed rgba(0, 0, 0, 0.1);
		}
	}

	& .folder__content {
		transition: 200ms ease-in-out;
		position: relative;
		overflow: hidden;

		height: ${({ isOpen }) => (isOpen ? "auto" : "0 !important")};
	}
`;

type FileProps = {
	isSelected: boolean;
};

export const File = styled.button<FileProps>`
	position: relative;
	background-color: #d9d9d9;
	padding: 1rem;
	padding-left: 3rem;
	border-radius: 5px;
	width: 100%;
	border: none;
	cursor: pointer;
	margin-top: 0.5rem;

	& > span[data-title] {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: fit-content;
	}

	display: flex;
	justify-content: flex-start;

	transition: filter 100ms ease-in;
	&:hover {
		filter: brightness(0.9);
	}

	${({ isSelected }) => {
		if (isSelected) {
			return css`
				box-shadow: inset 0 0 0 2px #24a8e0;
			`;
		}
	}}
`;

export const IconContainer = styled.span`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 1rem;
`;
