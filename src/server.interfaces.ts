export interface IRank {
	name: string;
	value: number;
}
export interface IStatus {
	name: string;
}

export interface IPermission {
	canSeeConsolePanel: boolean;
	canEditGeneralSettings: boolean;
	canEditThemeSettings: boolean;
	canResetServer: boolean;
	canEditRooms: boolean;
	canEditUsers: boolean;
	canSeeLoginRecords: boolean;
	canEditStatusList: boolean;
	canEditRanks: boolean;
	canSeeComplaints: boolean;
	canSeeIpOfUsers: boolean;
	canSeeIpBans: boolean;
	canSendToAll: boolean;
	canResetChatForAll: boolean;
	canSeeAuthorities: boolean;
	canRemovePermissions: boolean;
	canIpBan: boolean;
	canBan: boolean;
	canKickMic: boolean;
	canBanMic: boolean;
	canBanCam: boolean;
}
export interface IPreference {
	notificationEnabled: boolean;
	fontColor: string;
	fontSize: number;
	allowPrivateMessagesFromOthers: boolean;
	allowVoiceCallsFromOthers: boolean;
	allowVideoCallsFromOthers: boolean;
}
export interface IUser {
	username: string;
	gender: boolean;
	about: string;
	profileImage: string;
	banned: boolean;
	preventMic: boolean;
	preventCam: boolean;
	created: string;
	permission: IPermission;
	preference: IPreference;
	status: IStatus;
	rank: IRank;
}

export interface IMessage {
	id: number;
	content: string;
	created: Date;
	sender: IUser;
	room: IRoom;
}

export interface IRoom {
	id: number;
	row: number;
	name: string;
	slogan: string;
	active: boolean;
	default: boolean;
	bg: string;
}
