import { Socket } from 'socket.io-client';
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$socket: Socket;
	}
}
