import styled, { css } from 'styled-components';

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

	div[data-user] {
		display: flex;
		align-items: center;

		& > div {
			display: inline-flex;
			align-items: center;
			margin-left: 1rem;
		}
	}

	a[data-logout] {
		display: inline-flex;
		align-items: center;

		font-weight: bold;
		color: #f5222d;

		svg {
			margin-right: 0.1rem;
		}
	}
`;

export const HeaderLogoContainer = styled.div`
	padding: 0.4rem 0;
	height: 100%;

	& > img {
		height: 100%;
		width: auto;
	}
`;

export const MainContainer = styled.div`
	height: calc(100vh - ${config.header.height});

	display: grid;
	grid-template-columns: 3fr 8fr;
	padding: 1.5rem 0;
`;

export const SideBar = styled.aside`
	box-shadow: inset 0 0.5rem 1.5rem rgba(67, 67, 67, 0.1);
	padding: 0.5rem;
	height: 100%;
	border-radius: 5px;

	& > [data-folder]:first-child > button {
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
			transform: ${({ isOpen }) => (isOpen ? 'rotateX(0)' : 'rotateX(180deg) !important')};
		}
	}

	& .folder__container {
		margin-left: 1rem;
	}

	& .folder__content {
		transition: 200ms ease-in-out;
		position: relative;
		overflow: hidden;

		height: ${({ isOpen }) => (isOpen ? 'auto' : '0 !important')};
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
