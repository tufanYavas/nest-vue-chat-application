export interface IUserForClient extends IUser {
	room: IRoom;
	clientId: string;
}
export interface IRank {
	id: number;
	name: string;
	value: number;
}
export interface IStatus {
	name: string;
}

export interface IPermission {
	canSeeAdminPanel: boolean;
	canEditGeneralSettings: boolean;
	canEditThemeSettings: boolean;
	canResetServer: boolean;
	canEditRooms: boolean;
	canEditUsers: boolean;
	canSeeLoginLogs: boolean;
	canEditStatusList: boolean;
	canEditRanks: boolean;
	canSeeReports: boolean;
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
	id: number;
	username: string;
	gender: boolean;
	about: string;
	profileImage: string;
	banned: boolean;
	preventMic: boolean;
	preventCam: boolean;
	created: Date;
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
	default: boolean;
	bg: string;
	hasPassword: boolean;
}
