import { Socket } from 'socket.io-client';
import Swal from 'sweetalert2';
import { Socket } from 'socket.io-client';
import { $t } from 'vue-i18n';
import { MediaConnection } from 'peerjs';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$socket: Socket;
	}
}

declare global {
	interface Window {
		$: typeof import('jquery');
		jQuery: typeof import('jquery');
		Swal: typeof Swal;
		// socket: Socket<DefaultEventsMap, DefaultEventsMap>;
		webkitMediaStream: any;
		socket: Socket;
		$t: typeof $t;
	}
	interface Navigator {
		userLanguage: string;
		getUserMedia: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void,
		) => void;
		webkitGetUserMedia: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void,
		) => void;
		mozGetUserMedia: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void,
		) => void;
	}
}

declare type MediaType = 'VOICE' | 'VIDEO';
declare type CallType = 'PRIVATE' | 'ROOM';

interface Call {
	callerUser: IUserForClient;
	calledUser: IUserForClient;
	mediaType: MediaType;
	callType: CallType;
}

interface MediaConnectionWithMetadata extends MediaConnection {
	metadata: Call;
}

interface MediaStreamWrapper {
	callObject: MediaConnectionWithMetadata;
	stream: MediaStream;
	isCaller: boolean;
}

interface ISendMessage {
	user: IUserForClient;
	text: string;
	type: 'ROOM_MESSAGE' | 'ALL_MESSAGE' | 'SYSTEM_MESSAGE' | 'PRIVATE_MESSAGE' | 'ROOM_EVENT' | 'ALL_EVENT';
	toClientId?: string;
	contentType?: 'IMAGE';
	contentPath?: string;
}
interface IUserForClient extends IUser {
	room: IRoom;
	clientId: string;
}
interface IRank {
	name: string;
	value: number;
}
interface IStatus {
	id: number;
	name: string;
}

interface IPermission {
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
interface IPreference {
	notificationEnabled: boolean;
	fontColor: string;
	fontSize: number;
	allowPrivateMessagesFromOthers: boolean;
	allowVoiceCallsFromOthers: boolean;
	allowVideoCallsFromOthers: boolean;
}
interface IUser {
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

interface IMessage {
	id: number;
	content: string;
	created: Date;
	sender: IUser;
	room: IRoom;
}

interface IRoom {
	id: number;
	row: number;
	name: string;
	slogan: string;
	active: boolean;
	default: boolean;
	bg: string;
	hasPassword: boolean;
}
