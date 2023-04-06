import type { TUser } from '@/@types/iron-session.d';

export type TProjectSetting = {
	id: string;
	name: string;
	folder_name: string;
};

export type TProjectSettingComplete = {
	owner: TUser;
} & TProjectSetting;
