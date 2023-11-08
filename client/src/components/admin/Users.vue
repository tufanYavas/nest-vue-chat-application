<template>
	<div class="adminpages">
		<h3>
			<span><i class="fa fa-users"></i> {{ $t('Members') }} ({{ users.length }})</span>
		</h3>

		<div class="admincontent2">
			<div id="usersearch">
				<input id="usearch" type="text" :placeholder="$t('Search User')" v-model="searchUsersText" />
			</div>

			<div class="ausers" v-for="u in filteredUsers" :key="u.username">
				<input
					:id="`uploadUserImage${u.id}`"
					@change="onUserImageChanged($event, 'ADMIN_PROFILE_IMAGE_UPDATE', u)"
					accept=".jpg, .jpeg, .png, .gif"
					type="file"
					style="display: none"
				/>
				<div class="aimage">
					<img :src="getProfileImagePath(u)" :alt="u.username" />
				</div>
				<div class="aname">{{ u.username }}</div>
				<div class="aactions">
					<span class="aedit2" @click="showPermissions(u)"
						><i class="fa fa-superpowers"></i> {{ $t('Authority') }}</span
					><span class="aedit" @click="editUser(u)"
						><i class="fa fa-pencil-square-o"></i> {{ $t('Edit') }}</span
					>
					<span v-if="user.permission.canBan && !u.banned" class="aextra" @click="banUser(u)"
						><i class="fa fa-ban"></i> {{ $t('Ban') }}</span
					>
					<span v-if="user.permission.canBan && u.banned" class="aextra" @click="unbanUser(u)"
						><i class="fa fa-check"></i> {{ $t('Unban') }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IRank, IUser, IUserForClient } from '@/types';
import { getProfileImagePath, swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Users',
	data(): {
		users: IUser[];
		searchUsersText: string;
		ranks: IRank[];
	} {
		return {
			users: [],
			searchUsersText: '',
			ranks: [],
		};
	},
	props: {
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
	},
	emits: ['uploadImage'],
	inject: ['uploadImage'],
	mounted() {
		this.getUsers();
		axios
			.get('/rank')
			.then((response) => {
				this.ranks = response.data as IRank[];
			})
			.catch((error) => swalServerError(error));
	},
	methods: {
		getProfileImagePath,
		toTitleCase(str: string) {
			const spacedStr = str
				.replace(/([A-Z])/g, ' $1')
				.replace(/_/g, ' ')
				.replace(/\s+/g, ' ')
				.trim();

			return spacedStr
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		},
		banUser(user: IUser) {
			axios
				.post(`/admin/banUser/${user.id}`)
				.then(() => (user.banned = true))
				.catch((error) => swalServerError(error));
		},
		unbanUser(user: IUser) {
			axios
				.post(`/admin/unbanUser/${user.id}`)
				.then(() => (user.banned = false))
				.catch((error) => swalServerError(error));
		},
		getUsers() {
			axios
				.get('/admin/getUsers')
				.then((response) => {
					this.users = response.data;
				})
				.catch((error) => swalServerError(error));
		},
		onUserImageChanged(
			event: any,
			type: 'PROFILE_IMAGE' | 'CHAT_IMAGE' | 'ADMIN_PROFILE_IMAGE_UPDATE',
			user: IUser,
		) {
			(this.uploadImage as any)(event, type, user.id, (profileImage: string) => {
				user.profileImage = profileImage;
			});
			const imgElement = document.getElementById(`pp${user.id}`) as HTMLImageElement;
			if (imgElement) {
				const files = event.target.files;
				if (files && files[0]) {
					const reader = new FileReader();
					reader.onload = (e: any) => {
						// user.profileImage = e.target.result;
						imgElement.src = e.target.result;
					};
					reader.readAsDataURL(files[0]);
				}
			}
		},
		editUser(user: IUser) {
			Swal.fire({
				title: `<i class='fa fa-user'></i> ${this.$t('Edit User')}`,
				html: `
							<div id="profilesettings">
							<div id="_profileImage2" class="profile-image"><img id="pp${user.id}" src="${this.getProfileImagePath(
					user,
				)}" height="120"
								alt="${user?.username}" />
								<div class='placeholder'><i class='fa fa-cloud-upload' aria-hidden='true'></i></div>
							</div>
							<div class="profile-name">${user?.username}</div>
							<div class="form-group">
								<div class="swal2-label"><i class="fa fa-question-circle"></i>&nbsp;${this.$t('About Me')}:</div>
								<textarea class="swal2-textarea" id="aboutme" placeholder="${this.$t('Tell us briefly about yourself')}">${
					user?.about ?? ''
				}</textarea>
							</div>
							</div>
							<div class="form-group">
							<div class="swal2-label"><i class="fa fa-lock"></i>&nbsp;${this.$t('New Password')}:</div>
							<input type="password" id="password" autocomplete="off" placeholder="${this.$t('New Password')}}" class="swal2-input">
							</div>
							</div>
							</div>
						`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: this.$t('Save'),
				confirmButtonColor: '#0f1012',
				didOpen: () => {
					document!.getElementById('_profileImage2')!.addEventListener('click', () => {
						document!.getElementById(`uploadUserImage${user.id}`)!.click();
					});
				},
				preConfirm: () => {
					return {
						about: (document.getElementById('aboutme') as HTMLInputElement).value,
						password: (document.getElementById('password') as HTMLInputElement).value,
					};
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						axios
							.patch(`/admin/updateUser/${user.id}`, result.value)
							.then(async () => {
								user.about = result.value.about;
							})
							.catch((error: any) => {
								swalServerError(error);
							});
					}
				})
				.catch();
		},
		showPermissions(u: IUser) {
			let selectedPermissions: any;
			axios
				.get(`admin/findUser/${u.id}`)
				.then((response) => {
					const user = response.data as IUser;
					let selectHtml = '<select id="perms" class="swal2-select">';
					this.ranks.forEach((rank) => {
						selectHtml += `<option value="${rank.id}" ${rank.id === user.rank.id ? 'selected' : ''}>${
							rank.name
						}</option>`;
					});
					selectHtml += '</select>';

					// İzinler için checkbox'lar oluştur
					let checkboxesHtml = '';
					Object.keys(user.permission).forEach((permission) => {
						if (!permission.startsWith('can')) return;
						const checked = (user.permission as any)[permission] ? 'checked' : '';
						checkboxesHtml += `
							<div class="form-group">
								<div class="oo-switch">
								<span>${this.toTitleCase(permission)}</span>
								</div>
								<div class="oo-switch2">
								<div class="onoffswitch">
									<input type="checkbox" name="${permission}" class="onoffswitch-checkbox" id="${permission}" ${checked}>
									<label class="onoffswitch-label" for="${permission}"></label>
								</div>
								</div>
							</div>
							`;
					});

					Swal.fire({
						title: this.$t('Authorization'),
						html: selectHtml + checkboxesHtml,
						focusConfirm: false,
						confirmButtonColor: '#0f1012',
						confirmButtonText: this.$t('Save'),
						preConfirm: () => {
							const selectedRank = (document.getElementById('perms') as HTMLSelectElement).value;
							selectedPermissions = {};
							Object.keys(user.permission).forEach((permission) => {
								if (!permission.startsWith('can')) return;
								(selectedPermissions as any)[permission] = (
									document.getElementById(permission) as HTMLInputElement
								).checked;
							});
							return {
								rank: selectedRank,
								permissions: selectedPermissions,
							};
						},
					}).then((result) => {
						if (result.isConfirmed) {
							axios
								.patch('/admin/updatePermissions', {
									user_id: user.id,
									rank_id: parseInt(result.value.rank),
									permissions: result.value.permissions,
								})
								.then(() => {
									Object.assign(u, response.data);
									// TODO user updated event
									Swal.fire(this.$t('Successful'), undefined, 'success');
								})
								.catch((error) => swalServerError(error));
						}
					});
				})
				.catch((error) => swalServerError(error));
		},
	},
	computed: {
		filteredUsers(): IUser[] {
			return this.users.filter((user: IUser) =>
				user.username.toLowerCase().includes(this.searchUsersText.toLowerCase()),
			);
		},
	},
});
</script>
