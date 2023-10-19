import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { IRoom, IUser } from '@/interfaces/server.interfaces';

export interface ISendMessage {
	text: string;
	type: 'MESSAGE' | 'EVENT' | 'SYSTEM_MESSAGE' | 'PRIVATE_MESSAGE';
}
export interface IExtraData {
	room: IRoom;
	user: IUser;
}
export interface IBaseEvent {
	userid: string;
	extra: IExtraData;
}
export interface IOnMessageEvent extends IBaseEvent {
	data: ISendMessage;
	latency?: number;
}
export interface IOnLeaveEvent extends IBaseEvent {}
export interface IOnOpenEvent extends IBaseEvent {}
export interface IOnExtraDataUpdatedEvent extends IBaseEvent {}

export interface IRTCMultiConnection {
	sessionid: string;
	channel: string;
	peers: object;
	socketOptions: Partial<ManagerOptions & SocketOptions>;
	openOrJoin: (name: string) => void;
	waitingForLocalMedia: boolean;
	open(): any;
	peersBackup: object;
	deletePeer(): any;
	rejoin(): any;
	join(): any;
	publicRoomIdentifier: string;
	captureUserMedia(): any;
	getUserMedia(): any;
	onbeforeunload(): any;
	closeBeforeUnload: boolean;
	userid: string;
	changeUserId(): any;
	extra: IExtraData;
	attachStreams: any[];
	session: object;
	enableFileSharing: boolean;
	bandwidth: object;
	codecs: object;
	processSdp(): any;
	CodecsHandler: object;
	BandwidthHandler: object;
	mediaConstraints: object;
	sdpConstraints: { mandatory: any };
	sdpSemantics: string;
	iceCandidatePoolSize: object;
	bundlePolicy: object;
	rtcpMuxPolicy: object;
	iceTransportPolicy: object;
	optionalArgument: object;
	iceServers: object;
	candidates: object;
	iceProtocols: object;
	onopen: (event: IOnOpenEvent) => void;
	onclose(): any;
	onerror(): any;
	onmessage: (event: IOnMessageEvent) => void;
	send: (message: ISendMessage) => void;
	leave(): any;
	disconnect(): any;
	close(): any;
	closeEntireSession(): any;
	onEntireSessionClosed(): any;
	onstream(): any;
	onstreamended(): any;
	direction: string;
	removeStream(): any;
	addStream(): any;
	invokeGetUserMedia(): any;
	applyConstraints(): any;
	replaceTrack(): any;
	resetTrack(): any;
	renegotiate(): any;
	setStreamEndHandler(): any;
	onMediaError(): any;
	autoCloseEntireSession: boolean;
	videosContainer: object;
	filesContainer: object;
	isInitiator: boolean;
	shareFile(): any;
	onFileStart(): any;
	onFileProgress(): any;
	onFileEnd(): any;
	autoTranslateText: boolean;
	language: string;
	googKey: string;
	Translator: object;
	token(): any;
	onNewParticipant: (participantId: any, userPreferences: any) => void;
	acceptParticipationRequest(participantId: any, userPreferences: any): any;
	StreamsHandler: object;
	onleave: (event: IOnLeaveEvent) => void;
	invokeSelectFileDialog(): any;
	onmute(): any;
	onunmute(): any;
	onExtraDataUpdated: (event: IOnExtraDataUpdatedEvent) => void;
	getAllParticipants(): string[];
	connectSocket(): any;
	closeSocket(): any;
	getSocket(): any;
	getRemoteStreams(): any;
	streamEvents: object;
	socketURL: string;
	socketMessageEvent: string;
	socketCustomEvent: string;
	DetectRTC: {
		load: (cb: () => void) => void;
	};
	setCustomSocketEvent(event: string): any;
	getNumberOfBroadcastViewers(): any;
	onNumberOfBroadcastViewersUpdated(): any;
	onUserStatusChanged(): any;
	getUserMediaHandler(): any;
	multiPeersHandler: object;
	enableLogs: boolean;
	setCustomSocketHandler(): any;
	chunkSize: number;
	maxParticipantsAllowed: number;
	disconnectWith(): any;
	checkPresence(): any;
	onReadyForOffer(): any;
	setUserPreferences(): any;
	updateExtraData(): any;
	enableScalableBroadcast: boolean;
	maxRelayLimitPerUser: number;
	dontCaptureUserMedia: boolean;
	dontAttachStream: boolean;
	dontGetRemoteStream: boolean;
	onReConnecting(): any;
	beforeAddingStream(): any;
	beforeRemovingStream(): any;
	checkIfChromeExtensionAvailable(): any;
	getChromeExtensionStatus(): any;
	getScreenConstraints(): any;
	modifyScreenConstraints(): any;
	onPeerStateChanged(): any;
	isOnline: boolean;
	isLowBandwidth: boolean;
	getExtraData(): any;
	onUserIdAlreadyTaken(): any;
	trickleIce: boolean;
	version: string;
	onSettingLocalDescription(): any;
	resetScreen(): any;
	autoCreateMediaElement: boolean;
	password: object;
	setPassword(): any;
	onSocketDisconnect(): any;
	onSocketError(): any;
	errors: object;
	getExternalIceServers: boolean;
	socketAutoReConnect: boolean;
	socket: Socket;
}
