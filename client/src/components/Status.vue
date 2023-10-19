<template>
	<div id="status">
		<div class="container" @click="toggleStatusMenu">
			<span class="small"
				><i class="fa fa-chevron-down" aria-hidden="true"></i>
				{{ $t('Your Status') }}</span
			><br />
			<div>{{ localCurrentStatus }}</div>
		</div>
		<ul v-if="showStatusMenu" id="statusmenu">
			<a
				v-for="status in allStatuses"
				:key="status.id"
				:class="{ selected: status.name === localCurrentStatus }"
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
import axios from 'axios';
import { defineComponent } from 'vue';

interface Status {
	id: number;
	name: string;
}

export default defineComponent({
	name: 'Status',
	data(): {
		showStatusMenu: boolean;
		allStatuses: Status[];
		usertype: number;
		localCurrentStatus: string;
	} {
		return {
			allStatuses: [],
			showStatusMenu: false,
			usertype: 0,
			localCurrentStatus: this.currentStatus,
		};
	},
	props: {
		currentStatus: {
			type: String,
			default: '',
		},
	},
	methods: {
		toggleStatusMenu() {
			this.showStatusMenu = !this.showStatusMenu;
			if (this.showStatusMenu) {
				document.addEventListener('click', this.outsideClickListener);
			} else {
				document.removeEventListener(
					'click',
					this.outsideClickListener,
				);
			}
		},
		outsideClickListener(event: { target: any }) {
			if (!this.$el.contains(event.target)) {
				this.showStatusMenu = false;
				document.removeEventListener(
					'click',
					this.outsideClickListener.bind(this),
				);
			}
		},

		statusClicked(id: number) {
			this.localCurrentStatus = this.allStatuses.find(
				(x) => x.id == id,
			)!.name;
			axios.post('/user/setStatus', { id }).catch((reason: any) => {
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

<style scoped>
#statusmenu {
	display: block;
}
</style>
