import styled, { css } from "styled-components";

/* Folder components */

export const FolderTrigger = styled.button`
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

		& [data-folder-arrow] {
			display: none;
		}
	}

	& [data-folder-arrow] {
		position: absolute;
		right: 1rem;
		top: 25%;
		transition: transform 200ms ease-in-out;
		transform: rotateX(0);
	}
`;

export const FolderContainer = styled.div`
	position: relative;
	padding-left: 1rem;

	&::before {
		content: "";
		position: absolute;
		top: 0.5rem;
		left: 0;
		bottom: 0;
		border: 1px dashed rgba(0, 0, 0, 0.1);
		display: block;
	}
`;

export const FolderContent = styled.div`
	transition: 200ms ease-in-out;
	position: relative;
	overflow: hidden;
	height: auto;
`;

export const Folder = styled.div`
	display: block;

	&[aria-expanded="false"] {
		${FolderTrigger} [data-folder-arrow] {
			transform: rotateX(180deg) !important;
		}

		${FolderContainer}::before {
			display: none !important;
		}

		${FolderContent} {
			height: 0 !important;
		}
	}
`;

/* File components */

export const File = styled.button`
	position: relative;
	background-color: #d9d9d9;
	padding: 1rem;
	padding-left: 3rem;
	padding-right: calc(2rem + 18px);
	border-radius: 5px;
	width: 100%;
	border: none;
	cursor: pointer;
	margin-top: 0.5rem;
	transition: filter 100ms ease-in;
	display: flex;
	justify-content: flex-start;

	&:hover {
		filter: brightness(0.9);
	}

	&[data-file-selected="true"] {
		box-shadow: inset 0 0 0 2px #24a8e0 !important;
	}

	& > [data-title] {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: fit-content;
	}

	& > button[data-download] {
		transform: translateY(-50%);
		position: absolute;
		right: 1rem;
		top: 50%;
		background: transparent;
		border: 0;

		display: flex;
		justify-content: center;
		align-items: center;

		svg {
			margin-left: 1px;
			transition: transform 100ms ease-in-out;
		}

		&:hover svg {
			transform: scale(1.3);
		}
	}
`;

export const IconContainer = styled.span`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 1rem;
`;
