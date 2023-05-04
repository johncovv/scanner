import styled, { css } from "styled-components";

export const Trigger = styled.button`
	position: relative;
	display: block;
	width: 100%;
	padding: 0.5rem 2rem 0.5rem 1rem;
	border: none;
	border-radius: 5px;
	transition: filter 100ms ease-in-out;

	font-size: 14px;
	font-weight: bold;
	background-color: rgba(255, 255, 255, 0.2);
	color: #fff;

	&:hover {
		filter: brightness(0.9);
	}

	& > [data-trigger-arrow] {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		transition: transform 100ms ease-in-out;
	}
`;

export const Content = styled.div`
	position: absolute;
	z-index: 5;
	top: 100%;
	left: 0;
	right: 0;

	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 11px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	margin-top: 0.5rem;
	padding: 0.5rem;
	display: flex;
	background-color: #ffffff;
	transition: opacity 100ms ease-in-out;

	& > [data-dropdown-children] {
		width: 100%;
	}
`;

export const Container = styled.div`
	position: relative;
	min-width: 200px;

	&[aria-expanded="false"] {
		[data-trigger-arrow] {
			transform: translateY(-50%) rotate(180deg);
		}

		${Content} {
			pointer-events: none;
			opacity: 0;
		}
	}
`;
