<template>
	<div class="adminpages">
		<h3 style="position: relative">
			<span><i class="fa fa-list-ul"></i> {{ $t('Status List') }} ({{ statusses.length }})</span>
			<span class="add-status" @click="createStatus()"> <i class="fa fa-plus"></i> {{ $t('Add') }} </span>
		</h3>

		<div class="admincontent2">
			<div id="usersearch">
				<input id="usearch" type="text" placeholder="Durum ara..." />
			</div>

			<div v-for="status in statusses" :key="status.id" class="ausers">
				<div class="aname">{{ status.name }}</div>
				<div class="aactions">
					<span class="aedit" @click="updateStatus(status)">
						<i class="fa fa-pencil-square-o"></i> {{ $t('Edit') }}
					</span>
					<span class="aremove" @click="deleteStatus(status)">
						<i class="fa fa-times"></i> {{ $t('Delete') }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IStatus } from '@/types';
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Status',
	data(): {
		statusses: IStatus[];
	} {
		return {
			statusses: [],
		};
	},
	mounted() {
		this.getStatusses();
	},
	methods: {
		getStatusses() {
			axios
				.get('/status')
				.then((response) => (this.statusses = response.data))
				.catch((error) => swalServerError(error));
		},
		showSwal(type: 'EDIT' | 'CREATE', status: IStatus | undefined = undefined) {
			Swal.fire({
				title: `<i class='fa fa-list-ul'></i> ${
					type === 'CREATE' ? this.$t('Create Status') : this.$t('Edit Status')
				}`,
				html: `
							<div class="form-group">
							<div class="swal2-label">${this.$t('Status Name')}</div>
							<input id="statusName" placeholder="${this.$t('Status Name')}" class="swal2-input">
							</div>
							</div>
							</div>
						`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: type === 'CREATE' ? this.$t('Create') : this.$t('Save'),
				confirmButtonColor: '#0f1012',
				preConfirm: () => {
					return {
						name: (document.getElementById('statusName') as HTMLInputElement).value,
					};
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						(type === 'CREATE'
							? axios.post(`/admin/createStatus`, result.value)
							: axios.patch(`/admin/updateStatus/${status?.id}`, result.value)
						)
							.then(this.getStatusses)
							.catch((error: any) => {
								swalServerError(error);
							});
					}
				})
				.catch();
		},
		createStatus() {
			this.showSwal('CREATE');
		},
		updateStatus(status: IStatus) {
			this.showSwal('EDIT', status);
		},
		deleteStatus(status: IStatus) {
			axios
				.delete(`/admin/deleteStatus/${status.id}`)
				.then(this.getStatusses)
				.catch((error: any) => {
					swalServerError(error);
				});
		},
	},
});
</script>

<style scoped>
.add-status {
	cursor: pointer;
	position: absolute;
	font-weight: bold;
	color: #666;
	display: block;
	width: auto;
	height: auto;
	margin: 0;
	padding: 0;
	right: 20px;
	top: 22px;
}
</style>
