import styled from "styled-components";

const config = {
	header: {
		height: "58px",
	},
};

export const Header = styled.header`
	background: linear-gradient(to left, #60bcd5, #24a3da 25%);
	height: ${config.header.height};
	margin-bottom: 1.5rem;
`;

export const HeaderContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	div[data-user] {
		display: flex;
		align-items: center;
		color: #ffffff;

		& > div {
			display: inline-flex;
			align-items: center;
			margin-left: 1rem;
		}
	}

	a[data-logout] {
		display: inline-flex;
		align-items: center;

		font-size: 14px;
		font-weight: bold;
		padding: 0.5rem 1rem;
		border-radius: 5px;

		background-color: rgba(255, 255, 255, 0.2);
		transition: background-color 100ms ease-in-out;
		&:hover {
			background-color: rgba(255, 255, 255, 0.3);
		}

		svg {
			font-size: 16px;
			margin-right: 0.1rem;
		}
	}
`;

export const LogoContainer = styled.div`
	padding: 0.4rem 0;
	height: 90%;

	& > img {
		height: 100%;
		width: auto;
	}
`;

export const MainContainer = styled.div`
	max-height: calc(100vh - (${config.header.height} + (1.5rem * 2)));
	min-height: calc(100vh - (${config.header.height} + (1.5rem * 2)));

	padding: 1.5rem 0;
	display: flex;
	flex-direction: row;
`;

export const SideBar = styled.aside`
	box-shadow: inset 0 0.5rem 1.5rem rgba(67, 67, 67, 0.1);
	padding: 0.5rem;
	border-radius: 5px;
	width: 350px;
	min-width: 350px;
	max-width: 350px;

	max-height: calc(100vh - (${config.header.height} + (1.5rem * 2)));
	margin-left: 1.5rem;
	overflow-y: auto;

	& > [data-folder]:first-child > button {
		margin-top: 0 !important;
	}
`;

export const Content = styled.main`
	max-height: calc(100vh - (${config.header.height} + (1.5rem * 2)));
	min-height: calc(100vh - (${config.header.height} + (1.5rem * 2)));
	margin-left: 1.5rem;
	flex-grow: 1;
	overflow: auto;

	background-color: var(--doc-preview-bg);
	border-radius: 5px;

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: none;
	}

	[data-empty] {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		color: #ffffff;

		h2 {
			margin-top: 1.5rem;
		}

		p {
			margin-top: 0.5rem;
		}
	}
`;
