import Swal from 'sweetalert2';

declare global {
	interface Window {
		$: typeof import('jquery');
		jQuery: typeof import('jquery');
		Swal: typeof Swal;
	}
}
