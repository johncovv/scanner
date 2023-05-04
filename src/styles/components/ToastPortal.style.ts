import styled from "styled-components";

import { config } from "../config";

export const Container = styled.div`
	position: fixed;
	top: calc(${config.header.height} + 1rem);
	width: fit-content;
	z-index: 15;

	left: 50%;
	transform: translateX(-50%);

	display: flex;
	flex-direction: column;
	justify-content: center;
`;
