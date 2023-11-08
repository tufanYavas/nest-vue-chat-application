<template>
	<div class="adminpages">
		<h3 style="position: relative">
			<span><i class="fa fa-list-ul"></i> {{ $t('Rank List') }}</span>
		</h3>

		<div class="admincontent2">
			<div v-for="rank in ranks" :key="rank.id" class="ausers">
				<div class="aname">{{ rank.name }}</div>
				<div class="aactions">
					<span class="aedit" @click="updateRank(rank)">
						<i class="fa fa-pencil-square-o"></i> {{ $t('Rank') }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IRank } from '@/types';
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Rank',
	data(): {
		ranks: IRank[];
	} {
		return {
			ranks: [],
		};
	},
	mounted() {
		this.getRanks();
	},
	methods: {
		getRanks() {
			axios
				.get('/rank')
				.then((response) => (this.ranks = response.data))
				.catch((error) => swalServerError(error));
		},
		updateRank(rank: IRank) {
			Swal.fire({
				title: `<i class='fa fa-edit'></i> ${this.$t('Edit rank')}`,
				html: `
							<div class="form-group">
							<div class="swal2-label">${this.$t('Rank Name')}</div>
							<input id="rankName" placeholder="${this.$t('Rank Name')}" class="swal2-input">
							</div>
							</div>
							</div>
						`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: this.$t('Save'),
				confirmButtonColor: '#0f1012',
				preConfirm: () => {
					return {
						name: (document.getElementById('rankName') as HTMLInputElement).value,
					};
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						axios
							.patch(`/admin/updateRank/${rank.id}`, result.value)
							.then(this.getRanks)
							.catch((error: any) => {
								swalServerError(error);
							});
					}
				})
				.catch();
		},
	},
});
</script>
