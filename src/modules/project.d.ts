import type { TUser } from '@/@types/iron-session.d';

export type TProjectSetting = {
	name: string;
};

export type TProjectSettingComplete = {
	owner: TUser;
} & TProjectSetting;
