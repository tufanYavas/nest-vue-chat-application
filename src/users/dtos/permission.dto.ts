import { Expose } from 'class-transformer';

export class PermissionDto {
	@Expose()
	canSeeConsolePanel: boolean;

	@Expose()
	canEditGeneralSettings: boolean;

	@Expose()
	canEditThemeSettings: boolean;

	@Expose()
	canResetServer: boolean;

	@Expose()
	canEditRooms: boolean;

	@Expose()
	canEditUsers: boolean;

	@Expose()
	canSeeLoginRecords: boolean;

	@Expose()
	canEditStatusList: boolean;

	@Expose()
	canEditRanks: boolean;

	@Expose()
	canSeeComplaints: boolean;

	@Expose()
	canSeeIpBans: boolean;

	@Expose()
	canSendToAll: boolean;

	@Expose()
	canResetChatForAll: boolean;

	@Expose()
	canSeeAuthorities: boolean;

	@Expose()
	canRemovePermissions: boolean;

	@Expose()
	canSeeIpOfUsers: boolean;

	@Expose()
	canIpBan: boolean;

	@Expose()
	canBan: boolean;

	@Expose()
	canKickMic: boolean;

	@Expose()
	canBanMic: boolean;

	@Expose()
	canBanCam: boolean;
}
