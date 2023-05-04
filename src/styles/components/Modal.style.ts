import styled from "styled-components";

export const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999999999999999;

	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Content = styled.div`
	background-color: #ffffff;
	width: 650px;
	display: flex;
	flex-direction: column;
	border-radius: 5px;
`;

export const Header = styled.div`
	padding: 0.5rem 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);

	& [data-title] {
	}

	& [data-close] {
		border: none;
		background: transparent;
		width: fit-content;
		height: fit-content;
	}
`;

export const Body = styled.div`
	padding: 1rem;
`;

export const Footer = styled.div`
	padding: 0.5rem 1rem;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	border-top: 1px solid rgba(0, 0, 0, 0.06);

	& > button {
		margin-left: 1rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 5px;
		background-color: #ccc;
		color: #000;

		transition: filter 100ms ease-in-out;
		&:hover {
			filter: brightness(0.8);
		}

		&[data-primary] {
			background-color: var(--secondary-blue);
			color: #fff;
		}
	}
`;
