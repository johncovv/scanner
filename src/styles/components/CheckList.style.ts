import styled from "styled-components";

export const Container = styled.ol`
	list-style: none;
	color: #000;
`;

export const AddButton = styled.button`
	border: none;
	width: 100%;
	padding: 0.5rem 1rem;
	border-radius: 5px;

	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #d9d9d9;
	transition: filter 100ms ease-in-out;
	margin-top: 0.5rem;

	&:hover {
		filter: brightness(0.9);
	}

	[data-icon] {
		margin-right: 0.25rem;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 0.5rem;
	border-radius: 5px;
	margin-top: 0.5rem;
	background-color: #d9d9d9;
	border: 2px solid #000000;

	&:focus {
		outline: none;
	}
`;
