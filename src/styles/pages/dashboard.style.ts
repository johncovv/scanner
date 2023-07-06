import styled from "styled-components";
import { config } from "../config";

export const MainContainer = styled.div`
	max-height: calc(100vh - (${config.header.height}));
	min-height: calc(100vh - (${config.header.height}));

	display: flex;
	flex-direction: row;
	padding-top: 1.5rem !important;
`;

export const SideBar = styled.aside`
	box-shadow: inset 0 0.5rem 1.5rem rgba(67, 67, 67, 0.1);
	padding: 0.5rem;
	border-radius: 5px;
	width: 350px;
	min-width: 350px;
	max-width: 350px;

	max-height: calc(100vh - (${config.header.height}));
	overflow-y: auto;

	& > [data-folder]:first-child > button,
	& > button[data-file]:first-child {
		margin-top: 0 !important;
	}
`;

export const Content = styled.main`
	margin-left: 1.5rem;
	flex-grow: 1;
	overflow: auto;

	background-color: var(--doc-preview-bg);
	border-radius: 5px 5px 0 0;

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

	&[data-extension="html"] {
		background-color: #ffffff !important;
	}
`;
