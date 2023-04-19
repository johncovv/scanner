import styled from "styled-components";

import { config } from "./config";

export const Container = styled.div`
	max-height: calc(100vh - ${config.header.height});
	min-height: calc(100vh - ${config.header.height});

	padding: 1.5rem;

	display: grid;
	grid-template-columns: 3fr 1fr;
	gap: 1.5rem;
`;

export const ActionsContainer = styled.div`
	border: 1px solid var(--primary-blue);
	height: fit-content;

	[data-title] {
		background-color: var(--primary-blue);
		font-weight: bold;
		padding: 0.5rem;
		color: #fff;
	}

	[data-content] {
		display: flex;
		padding: 1rem;
	}
`;

export const Button = styled.button`
	width: 100%;
	background-color: var(--secondary-blue);
	padding: 0.75rem;
	border: none;
	border-radius: 4px;
	color: #fff;
	cursor: pointer;
	outline: none;

	transition: 100ms ease-in-out;
	&:hover,
	&:focus {
		box-shadow: 0 0 0 2px #000000;
	}
`;

export const Table = styled.table`
	border-collapse: collapse;
	height: fit-content;

	&,
	th,
	td {
		border: 1px solid #000000;
	}

	th,
	td {
		padding: 0.25rem 0.5rem;
	}
`;
