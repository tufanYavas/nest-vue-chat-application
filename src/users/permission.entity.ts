import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  canSeeConsolePanel: boolean;

  @Column({ default: false })
  canEditGeneralSettings: boolean;

  @Column({ default: false })
  canEditThemeSettings: boolean;

  @Column({ default: false })
  canEditVpnSettings: boolean;

  @Column({ default: false })
  canResetServer: boolean;

  @Column({ default: false })
  canEditRooms: boolean;

  @Column({ default: false })
  canEditUsers: boolean;

  @Column({ default: false })
  canSeeLoginRecords: boolean;

  @Column({ default: false })
  canEditStatusList: boolean;

  @Column({ default: false })
  canEditRanks: boolean;

  @Column({ default: false })
  canSeeComplaints: boolean;

  @Column({ default: false })
  canSeeIpBans: boolean;

  @Column({ default: false })
  canSendToAll: boolean;

  @Column({ default: false })
  canResetChatForAll: boolean;

  @Column({ default: false })
  canSeeAuthorities: boolean;

  @Column({ default: false })
  canRemovePermissions: boolean;

  @Column({ default: false })
  canIpBan: boolean;

  @Column({ default: false })
  canBan: boolean;

  @Column({ default: false })
  canKickMic: boolean;

  @Column({ default: false })
  canBanMic: boolean;

  @Column({ default: false })
  canBanCam: boolean;
}
