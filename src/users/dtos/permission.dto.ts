import { Expose } from 'class-transformer';

export class PermissionDto {
	@Expose()
	id: number;

	@Expose()
	canSeeAdminPanel: boolean;

	@Expose()
	canEditGeneralSettings: boolean;

	@Expose()
	canEditRooms: boolean;

	@Expose()
	canEditUsers: boolean;

	@Expose()
	canSeeLoginLogs: boolean;

	@Expose()
	canEditStatusList: boolean;

	@Expose()
	canEditRanks: boolean;

	@Expose()
	canSeeReports: boolean;

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
