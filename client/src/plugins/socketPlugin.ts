import { io, Socket } from 'socket.io-client';

const socket: Socket = io(process.env.VUE_APP_SOCKET_URL, { autoConnect: false, withCredentials: true });

export default {
	install: (app: any) => {
		app.config.globalProperties.$socket = socket;
	},
};
