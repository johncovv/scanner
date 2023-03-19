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
	grid-template-columns: 2fr 6fr;

	& > * {
		border: 1px solid black;
	}
`;

export const SideBar = styled.aside`
	height: 100%;

	& *:first-child {
		margin-top: 0 !important;
	}
`;

type FolderProps = {
	isOpen: boolean;
	leafLength: number;
};

export const Folder = styled.div<FolderProps>`
	& .arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 1rem;
	}

	& .folder__title {
		position: relative;
		background-color: rgb(134, 134, 134);
		padding: 1rem;
		padding-left: 3rem;
		border-radius: 5px;
		width: 100%;
		border: none;
		cursor: pointer;
		margin-top: 0.5rem;

		display: flex;
		justify-content: space-between;

		&:hover {
			background-color: rgb(114, 114, 114);
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

		height: ${({ isOpen, leafLength }) => (isOpen ? `calc(${leafLength} * (47px + 0.5rem))` : '0')};
	}
`;

export const File = styled.button`
	position: relative;
	background-color: rgb(190, 190, 190);
	padding: 1rem;
	padding-left: 3rem;
	border-radius: 5px;
	width: 100%;
	border: none;
	cursor: pointer;
	margin-top: 0.5rem;

	display: flex;
	justify-content: space-between;

	&:hover {
		background-color: rgb(170, 170, 170);
	}
`;

export const IconContainer = styled.span`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 1rem;
`;

export const Content = styled.main`
	margin-left: 1.5rem;
	height: 100%;
`;
