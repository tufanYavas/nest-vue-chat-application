<template>
	<div class="adminpages">
		<h3 style="position: relative">
			<span><i class="fa fa-comment"></i> {{ $t('Rooms') }}</span>
			<span class="create-room" @click="createRoom"> <i class="fa fa-plus"></i> {{ $t('Create Room') }} </span>
		</h3>

		<div class="admincontent2">
			<div class="ausers roomsrow" v-for="room in rooms" :key="room.id">
				<div class="aname">
					<input
						class="mask"
						min="1"
						max="99"
						type="number"
						v-model="room.row"
						@change="roomRowChanged(room)"
					/>
					<span class="room-tname">{{ room.name }}</span>
				</div>

				<div class="aactions">
					<span class="aedit" @click="editRoom(room)">
						><i class="fa fa-pencil-square-o"></i> {{ $t('Edit') }}</span
					>
					<span v-if="!room.default" class="aextra" @click="makeDefaultRoom(room)"
						><i class="fa fa-arrow-right"></i> {{ $t('Make Default Room') }}</span
					>
					<span class="aremove" @click="deleteRoom(room)"
						><i class="fa fa-times"></i> {{ $t('Delete') }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IRoom } from '@/types';
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Rooms',
	data(): {
		rooms: IRoom[];
	} {
		return {
			rooms: [],
		};
	},
	mounted() {
		this.updateRooms();
	},
	methods: {
		updateRooms() {
			axios
				.get('/room')
				.then((response) => (this.rooms = response.data))
				.catch((error) => swalServerError(error));
		},
		showSwal(type: 'EDIT' | 'CREATE', room: IRoom | undefined = undefined) {
			Swal.fire({
				title: `<i class='fa fa-list-ul'></i> ${
					type === 'CREATE' ? this.$t('Create Room') : this.$t('Edit Room')
				}`,
				html: `<div class="form-group">
						<input type="text" class="swal2-input" value="${room && room.name ? room.name : ''}" id="rname" placeholder="${this.$t(
					'Room Name',
				)}*" maxlength="25">
						<input type="text" class="swal2-input" value="${
							room && room.slogan ? room.slogan : ''
						}" id="rslogan" placeholder="${this.$t('Room Slogan')}*" maxlength="25">
						<input type="text" class="swal2-input" value="${room && room.row ? room.row : ''}" id="rrow" placeholder="${this.$t(
					'Room Row',
				)}*" maxlength="25">
						<input type="text" class="swal2-input" value="${room && room.bg ? room.bg : ''}" id="rimage" placeholder="${this.$t(
					'Background Image URL',
				)}">
						<input type="text" class="swal2-input" id="rpassword" placeholder="${this.$t('Room Password')}">
					</div>`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: type === 'CREATE' ? this.$t('Create') : this.$t('Save'),
				confirmButtonColor: '#0f1012',
				preConfirm: () => {
					return {
						name: (document.getElementById('rname') as HTMLInputElement).value,
						slogan: (document.getElementById('rslogan') as HTMLInputElement).value,
						row: parseInt((document.getElementById('rrow') as HTMLInputElement).value),
						bg: (document.getElementById('rimage') as HTMLInputElement).value,
						password: (document.getElementById('rpassword') as HTMLInputElement).value,
					};
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						(type === 'CREATE'
							? axios.post(`/admin/createRoom`, result.value)
							: axios.patch(`/admin/updateRoom/${room?.id}`, result.value)
						)
							.then(this.updateRooms)
							.catch((error: any) => {
								swalServerError(error);
							});
					}
				})
				.catch();
		},
		editRoom(room: IRoom) {
			this.showSwal('EDIT', room);
		},
		createRoom() {
			this.showSwal('CREATE');
		},
		makeDefaultRoom(room: IRoom) {
			axios
				.patch(`/admin/makeDefaultRoom/${room.id}`)
				.then(() => this.updateRooms())
				.catch((error) => swalServerError(error));
		},
		deleteRoom(room: IRoom) {
			axios
				.delete(`/admin/deleteRoom/${room.id}`)
				.then(() => this.updateRooms())
				.catch((error) => swalServerError(error));
		},
		roomRowChanged(room: IRoom) {
			axios.patch(`/admin/updateRoomRow/${room.id}`, { row: room.row }).catch((error) => swalServerError(error));
		},
	},
});
</script>

<style scoped>
.create-room {
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
