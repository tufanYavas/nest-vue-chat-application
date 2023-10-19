import { SocketEventType } from '@/rtc/socket.enum';
import { IRTCMultiConnection } from '@/interfaces/RTCMultiConnection';
import { IRoom } from '@/interfaces/server.interfaces';
import axios from 'axios';

declare let RTCMultiConnection: {
	new (): IRTCMultiConnection; // Yeni bir instance oluşturmak için constructor tanımı
};

export class Connection {
	private static instance: IRTCMultiConnection;
	public static rooms: IRoom[];

	private constructor() {}

	public static getInstance(): Promise<IRTCMultiConnection> {
		return new Promise(async (resolve) => {
			if (!Connection.instance) {
				this.rooms = (await axios.get('/room')).data;
				const connection = new RTCMultiConnection();

				// const hrefSplit = window.location.href.split('/');

				connection.socketURL = 'http://localhost:3131/'; //hrefSplit[0] + '//' + hrefSplit[2] + '/';
				connection.socketOptions = {
					withCredentials: true,
				};
				connection.sdpSemantics = 'plan-b';
				connection.attachStreams = [];

				if (typeof window.webkitMediaStream !== 'undefined') {
					connection.attachStreams.push(new window.webkitMediaStream());
				} else if (typeof MediaStream !== 'undefined') {
					connection.attachStreams.push(new MediaStream());
				} else {
					console.error('Neither Chrome nor Firefox. This demo may NOT work.');
				}

				connection.autoCloseEntireSession = false;
				connection.dontCaptureUserMedia = true;

				connection.session = {
					data: true,
					audio: true,
					video: true,
				};

				connection.mediaConstraints = {
					video: true,
					audio: false,
				};

				connection.sdpConstraints.mandatory = {
					OfferToReceiveAudio: true,
					OfferToReceiveVideo: true,
				};

				connection.getExternalIceServers = false;

				connection.iceServers = [
					{ url: 'stun:stun.l.google.com:19302' },
					{ url: 'turn:homeo@turn.bistri.com:80', credential: 'homeo' },
					// {
					// 	url: process.env.VUE_APP_ICESERVER_STUN_URL,
					// 	username: process.env.VUE_APP_ICESERVER_STUN_USERNAME,
					// 	credential: process.env.VUE_APP_ICESERVER_STUN_CREDENTIAL,
					// },
					// {
					// 	url: process.env.VUE_APP_ICESERVER_TURN_URL,
					// 	username: process.env.VUE_APP_ICESERVER_TURN_USERNAME,
					// 	credential: process.env.VUE_APP_ICESERVER_TURN_CREDENTIAL,
					// },
				];

				for (const key in SocketEventType) {
					connection.setCustomSocketEvent(key);
				}

				connection.DetectRTC.load(() => {
					for (const room of this.rooms) {
						if (room.default) {
							connection.openOrJoin(room.name);
							connection.extra.room = room;
						}
					}
					Connection.instance = connection;
					resolve(Connection.instance);
				});
			} else {
				resolve(Connection.instance);
			}
		});
	}
}
