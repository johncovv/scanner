export interface IToastMessage {
	id: string;
	type: "success" | "error" | "warning" | "info" | "loading";
	message: string;
	duration?: number;
}
