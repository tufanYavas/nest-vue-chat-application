import Swal from 'sweetalert2';
import { Socket } from 'socket.io-client';
import { $t } from 'vue-i18n';

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
	}
}
