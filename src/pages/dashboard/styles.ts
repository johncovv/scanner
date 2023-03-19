import styled, { css, keyframes } from 'styled-components';

const config = {
	header: {
		height: '58px',
	},
};

export const Header = styled.header`
	height: ${config.header.height};

	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const MainContainer = styled.div`
	height: calc(100vh - ${config.header.height});

	display: grid;
	grid-template-columns: 3fr 8fr;
`;

export const SideBar = styled.aside`
	box-shadow: inset 0 0.5rem 1.5rem rgba(67, 67, 67, 0.1);
	padding: 0.5rem;
	height: 100%;
	border-radius: 5px;

	& *:first-child {
		margin-top: 0 !important;
	}

	& > * {
		margin-top: 0 !important;
	}
`;

export const Content = styled.main`
	margin-left: 1.5rem;
	height: 100%;

	background-color: #434343;
	border-radius: 5px;

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: none;
	}
`;

type FolderProps = {
	isOpen: boolean;
	leafLength: number;
};

export const Folder = styled.div<FolderProps>`
	& .folder__title {
		position: relative;
		background-color: #4096ff;
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

		transition: filter 100ms ease-in-out;
		&:hover {
			filter: brightness(1.1);
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
			transform: rotateX(${({ isOpen }) => (isOpen ? '0' : '180deg')});
		}
	}

	& .folder__container {
		margin-left: 1rem;
	}

	& .folder__content {
		transition: 200ms ease-in-out;
		position: relative;
		overflow: hidden;
		padding-top: 0.5rem;

		height: ${({ isOpen, leafLength }) => (isOpen ? `calc(${leafLength} * (47px + 0.5rem) + 0.5rem)` : '0')};
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

	display: flex;
	justify-content: space-between;

	transition: filter 100ms ease-in;
	&:hover {
		filter: brightness(0.85);
	}

	${({ isSelected }) => {
		if (isSelected) {
			return css`
				background-color: #91caff;
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
