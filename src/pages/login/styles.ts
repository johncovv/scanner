import styled from 'styled-components';

export const MainContainer = styled.main`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100vh;
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
`;

export const InputControl = styled.div`
	display: flex;
	flex-direction: column;

	margin-bottom: 1rem;

	& > label {
		margin-bottom: 0.5rem;
	}

	& > input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		min-width: 300px;

		&:focus {
			outline: none;
			border-color: #000;
		}
	}
`;

export const SubmitButton = styled.button`
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	background-color: #000;
	color: #fff;
	cursor: pointer;
`;
