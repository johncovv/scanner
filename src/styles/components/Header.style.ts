import styled from "styled-components";

import { config } from "@/styles/config";

export const Container = styled.header`
	background: linear-gradient(to left, var(--tertiary-color), var(--primary-color) 25%);
	height: ${config.header.height};
`;

export const Content = styled.div`
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

export const TitleContainer = styled.div`
	height: 100%;
	display: flex;
	flex-direction: row nowrap;
	align-items: center;

	[data-title] {
		margin-left: 1.5rem;
		color: #ffffff;
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
