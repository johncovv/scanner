import { TDataTreeFile } from "@/@types/tree";

export async function renderDocxFile(projectId: string, file: TDataTreeFile): Promise<void> {
	try {
		const targetFile = await fetch(`/api/static/${projectId}/${file.path}`);

		const fileBuffer = await targetFile.arrayBuffer();

		if (typeof document != "undefined") {
			const docx = require("docx-preview");

			const targetElementRender = document.querySelector("[data-docx-preview]")!;

			docx.renderAsync(fileBuffer, targetElementRender, undefined, {
				className: "docx", //class name/prefix for default and document style classes
				inWrapper: true, //enables rendering of wrapper around document content
				ignoreWidth: false, //disables rendering width of page
				ignoreHeight: false, //disables rendering height of page
				ignoreFonts: false, //disables fonts rendering
				breakPages: true, //enables page breaking on page breaks
				ignoreLastRenderedPageBreak: false, //disables page breaking on lastRenderedPageBreak elements
				experimental: false, //enables experimental features (tab stops calculation)
				trimXmlDeclaration: false, //if true, xml declaration will be removed from xml documents before parsing
				useBase64URL: false, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
				useMathMLPolyfill: false, //includes MathML polyfills for chrome, edge, etc.
				showChanges: false, //enables experimental rendering of document changes (inserions/deletions)
				debug: false, //enables additional logging
			});
		}
	} catch (error) {
		throw new Error("Error reading file");
	}
}
