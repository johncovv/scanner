import styled, { keyframes } from "styled-components";

const rotate = keyframes`
	from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
`;

export const Container = styled.div`
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 400px;
	width: fit-content;
	border-radius: 1rem;
	padding: 0.5rem;
	margin: 0 auto;

	box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

	&:not(:last-of-type) {
		margin-bottom: 1rem;
	}

	svg {
		display: block;
		margin-right: 0.3rem;
	}

	&[data-type="loading"] svg {
		animation: ${rotate} 1s linear infinite;
	}
`;

export const MessageBody = styled.div`
	flex: 1;
`;
