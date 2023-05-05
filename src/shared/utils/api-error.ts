export class ApiError extends Error {
	code: number;
	ptMessage?: string;
	data?: any;

	constructor(code: number, message: string, ptMessage?: string, data: any = null) {
		super(message);
		this.code = code;
		this.ptMessage = ptMessage;
		this.data = data;
	}
}
