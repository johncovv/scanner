import type { TUser, TPublicUser } from "@/@types/session.d";
import type { TTask } from "@/@types/task.d";

export type TProjectSetting = {
	id: string;
	name: string;
	folder_name: string;
	tasks?: Array<TTask>;
};

export type TProjectSettingComplete = {
	owner: TUser;
} & TProjectSetting;

export type TPublicProjectSettingComplete = {
	owner: TPublicUser;
} & TProjectSetting;
