<template>
	<div id="status">
		<div class="container" @click="toggleStatusMenu">
			<span class="small"><i class="fa fa-chevron-down" aria-hidden="true"></i> {{ $t('Your Status') }}</span
			><br />
			<div>{{ currentStatus.name }}</div>
		</div>
		<ul v-if="showStatusMenu" id="statusmenu">
			<a
				v-for="status in allStatuses"
				:key="status.id"
				:class="{ selected: status.id === currentStatus.id }"
				:title="status.name"
				@click.prevent="statusClicked(status.id)"
			>
				<li>
					{{ status.name }}
				</li>
			</a>
		</ul>
	</div>
</template>

<script lang="ts">
import { IUserForClient } from '@/interfaces/server.interfaces';
import axios from 'axios';
import { defineComponent } from 'vue';
import { IStatus } from '@/interfaces/server.interfaces';

export default defineComponent({
	name: 'Status',
	data(): {
		showStatusMenu: boolean;
		allStatuses: IStatus[];
		usertype: number;
	} {
		return {
			allStatuses: [],
			showStatusMenu: false,
			usertype: 0,
		};
	},
	props: {
		currentStatus: {
			type: Object as () => IStatus,
			default: '',
		},
	},
	emits: ['update:currentStatus'],
	methods: {
		toggleStatusMenu() {
			this.showStatusMenu = !this.showStatusMenu;
			if (this.showStatusMenu) {
				document.addEventListener('click', this.outsideClickListener);
			} else {
				document.removeEventListener('click', this.outsideClickListener);
			}
		},
		outsideClickListener(event: { target: any }) {
			if (!this.$el.contains(event.target)) {
				this.showStatusMenu = false;
				document.removeEventListener('click', this.outsideClickListener.bind(this));
			}
		},

		statusClicked(id: number) {
			const localCurrentStatus = this.allStatuses.find((x) => x.id == id)!;
			axios
				.post('/user/setStatus', { id })
				.then(() => {
					this.$emit('update:currentStatus', localCurrentStatus);
				})
				.catch((reason: any) => {
					console.error(reason.message);
				});
		},
	},
	mounted() {},
	created() {
		axios
			.get('/status')
			.then((response) => {
				this.allStatuses = response.data;
			})
			.catch((error) => {
				console.error(error.message);
			});
	},
});
</script>
