export function swalServerError(error: any) {
	let message: string = '';
	console.log(error.response.data);
	if (error.response.data.message) {
		if (typeof error.response.data.message === 'object') {
			for (const msg of error.response.data.message) {
				message += window.$t(msg) + '<br>';
			}
		} else {
			message = error.response.data.message;
		}
	} else {
		message = error.message;
	}
	window.Swal.fire(window.$t('Error'), message, 'error');
}

export class MutexQueue {
	private queue: any[] = [];
	private isProcessing: boolean = false;

	async enqueue(task: () => void) {
		this.queue.push(task);

		if (!this.isProcessing) {
			await this.processQueue();
		}
	}

	private async processQueue() {
		this.isProcessing = true;

		while (this.queue.length > 0) {
			const currentTask = this.queue.shift();
			await currentTask();
		}

		this.isProcessing = false;
	}
}
