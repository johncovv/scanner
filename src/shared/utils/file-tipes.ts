import { IconType } from "react-icons";
import {
	BsFiletypePdf,
	BsFiletypeTxt,
	BsFiletypeDoc,
	BsFiletypeDocx,
	BsFiletypeXls,
	BsFiletypeMp4,
	BsFiletypeMp3,
	BsFiletypeXlsx,
	BsFiletypePng,
	BsFiletypeJpg,
	BsFiletypeGif,
	BsFiletypeHtml,
} from "react-icons/bs";

export const FILE_TYPES: {
	[key: string]: IconType;
} = {
	pdf: BsFiletypePdf,
	txt: BsFiletypeTxt,
	doc: BsFiletypeDoc,
	docx: BsFiletypeDocx,
	xls: BsFiletypeXls,
	xlsx: BsFiletypeXlsx,
	mp4: BsFiletypeMp4,
	mp3: BsFiletypeMp3,
	png: BsFiletypePng,
	jpg: BsFiletypeJpg,
	jpeg: BsFiletypeJpg,
	gif: BsFiletypeGif,
	html: BsFiletypeHtml,
};
