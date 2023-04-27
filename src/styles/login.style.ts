import styled from "styled-components";

export const MainContainer = styled.main`
	background: linear-gradient(to bottom, #f1f4f9, #60bcd5, #24a3da);
	background-size: cover;
	background-position: center;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	width: 100%;
	height: 100vh;
	overflow: hidden;
	position: relative;

	& > [data-color] {
		position: absolute;
		filter: blur(150px);

		&:nth-child(1) {
			top: -350px;
			background: #22a0d9;
			width: 600px;
			height: 600px;
		}
		&:nth-child(2) {
			bottom: -150px;
			left: 100px;
			background: #1375b4;
			width: 500px;
			height: 500px;
		}
		&:nth-child(3) {
			bottom: 50px;
			right: 0;
			background: #5697ae;
			width: 300px;
			height: 300px;
		}
	}
`;

export const LogoContainer = styled.div`
	margin-bottom: 1.5rem;

	& > img {
		max-width: 300px;
		height: auto;
	}
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
		padding: 0.75rem;
		border-radius: 4px;
		min-width: 300px;
		border: none;

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px #000000;
		}
	}
`;

export const SubmitButton = styled.button`
	padding: 0.75rem;
	border: none;
	border-radius: 4px;
	background-color: #166eae;
	color: #fff;
	cursor: pointer;
	outline: none;

	transition: 100ms ease-in-out;
	&:hover,
	&:focus {
		box-shadow: 0 0 0 2px #000000;
	}
`;
