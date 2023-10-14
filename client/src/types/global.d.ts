import Swal from 'sweetalert2';
import { Socket } from 'socket.io-client';

declare global {
	interface Window {
		$: typeof import('jquery');
		jQuery: typeof import('jquery');
		Swal: typeof Swal;
		socket: Socket<DefaultEventsMap, DefaultEventsMap>;
	}
}
