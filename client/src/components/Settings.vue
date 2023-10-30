<template>
	<div id="settings">
		<i @click="toggleSettingsMenu" id="settingsOpener" class="fa fa-cog" aria-hidden="true"></i>
		<ul v-if="showSettingsMenu" id="settingsmenu">
			<a v-if="user.permission.canSeeConsolePanel" href="" onclick="showKonsolPanel();" title="Konsol Paneli"
				><li>
					<i class="fa fa-hand-peace-o" aria-hidden="true"></i>
					Konsol Paneli
				</li></a
			>
			<a v-if="user.rank.value > 0" href="" onclick="showUserProfile();" title="Profil Ayarları"
				><li><i class="fa fa-user"></i> Profil Ayaları</li></a
			>
			<a v-if="user.rank.value == 0" href="#" @click="showRegisterForm" :title="$t('Register')"
				><li><i class="fa fa-clipboard"></i> {{ $t('Register') }}</li></a
			>
			<a class="d-hidden" href="" onclick="showPrivateMessages();" title="Mesaj Kutusu"
				><li>
					<i class="fa fa-comments-o" aria-hidden="true"></i>
					Mesaj Kutusu (<span class="messagecounter" id="messagecounter">0</span>)
				</li></a
			>
			<a href="" onclick="showMicCamSettings();" title="Mikrofon/Kamera Ayarları"
				><li><i class="fa fa-cog"></i> Mikrofon/Kamera</li></a
			>
			<a v-if="user.permission.canSendToAll" href="#" onclick="sendToAll();"
				><li><i class="fa fa-comment"></i> Tüm odalara mesaj</li></a
			>
			<a href="#" @click.prevent="$emit('resetChat')"
				><li><i class="fa fa-times"></i> Mesajları sil</li></a
			>
			<a v-if="user.permission.canResetChatForAll" href="#" onclick="_resetChatForAll();"
				><li><i class="fa fa-users"></i> Tüm ekranlarda sil</li></a
			>
			<a href="#"
				><li>
					<div>
						<div style="width: 100px" class="oo-switch">
							<i class="fa fa-cog"></i> Giriş ve çıkışları göster
						</div>
						<div style="margin-top: 10px" class="oo-switch2">
							<div class="onoffswitch">
								<input
									type="checkbox"
									name="onoffswitch"
									class="onoffswitch-checkbox"
									id="showSystemMessages"
									checked
								/>
								<label class="onoffswitch-label" for="showSystemMessages"></label>
							</div>
						</div>
					</div></li
			></a>

			<a href="" @click.prevent="logout" title="Çıkış yap"
				><li><i class="fa fa-sign-out"></i> Çıkış Yap</li></a
			>
		</ul>
	</div>
</template>

<script lang="ts">
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';
import { IUser } from '@/types';

export default defineComponent({
	name: 'Settings',
	data(): {
		showSettingsMenu: boolean;
	} {
		return {
			showSettingsMenu: false,
		};
	},
	props: {
		user: {
			type: Object as () => IUser,
			required: true,
		},
	},
	emits: ['resetChat', 'update:user'],
	methods: {
		async logout() {
			await axios.post('/auth/signout');
			this.$router.push('/login');
		},
		showRegisterForm() {
			Swal.fire({
				title: `<i class='fa fa-wpforms'></i> ${this.$t('Register')}`,
				html: `
					<input type="text" id="username" value="${this.user.username}" class="swal2-input" placeholder="${this.$t('Username')}">
					<input type="password" id="password" class="swal2-input" placeholder="${this.$t('Password')}">
					<input type="password" id="password2" class="swal2-input" placeholder="${this.$t('Confirm Password')}">
					<div>
						<label>
							<input type="radio" name="gender" value="male" class="swal2-radio" checked>
							${this.$t('Male')}
						</label>
						<label>
							<input type="radio" name="gender" value="female" class="swal2-radio">
							${this.$t('Female')}
						</label>
					</div>
				`,
				confirmButtonText: this.$t('Sign up'),
				focusConfirm: false,
				preConfirm: () => {
					const popup = Swal.getPopup();
					if (popup) {
						const usernameElement = Swal.getPopup()!.querySelector('#username') as HTMLInputElement;
						const passwordElement = Swal.getPopup()!.querySelector('#password') as HTMLInputElement;
						const passwordElement2 = Swal.getPopup()!.querySelector('#password2') as HTMLInputElement;
						const genderElement = Swal.getPopup()!.querySelector(
							'input[name="gender"]:checked',
						) as HTMLInputElement;

						const username = usernameElement.value;
						const password = passwordElement.value;
						const password2 = passwordElement2.value;
						const gender = genderElement.value == 'male';

						if (username.length == 0) {
							Swal.showValidationMessage(this.$t('You did not enter your username.'));
						}
						if (username.length < 3) {
							Swal.showValidationMessage(this.$t('Username must be at least 3 characters long.'));
						}
						if (username.length > 18) {
							Swal.showValidationMessage(this.$t('Username can be at most 18 characters long.'));
						}
						if (password.length < 6) {
							Swal.showValidationMessage(this.$t('Password must be at least 6 characters long.'));
						}
						if (password.length > 18) {
							Swal.showValidationMessage(this.$t('Password can be at most 18 characters long.'));
						}
						if (!password || !password2) {
							Swal.showValidationMessage(this.$t('Passwords do not match'));
						}
						return {
							username: username,
							password: password,
							gender: gender,
						};
					}
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						axios
							.post('/auth/signup', {
								username: result.value.username,
								password: result.value.password,
								gender: result.value.gender,
							})
							.then(async (response: any) => {
								setTimeout(() => {
									this.$emit('update:user', response.data);
									Swal.fire(this.$t('Successful'), undefined, 'success');
									this.$router.push('/login');
								}, 1200);
							})
							.catch((error: any) => {
								swalServerError(error);
							});
					}
				})
				.catch();
		},

		toggleSettingsMenu() {
			this.showSettingsMenu = !this.showSettingsMenu;
			if (this.showSettingsMenu) {
				document.addEventListener('click', this.outsideClickListener);
			} else {
				document.removeEventListener('click', this.outsideClickListener);
			}
		},
		outsideClickListener(event: { target: any }) {
			if (!this.$el.contains(event.target)) {
				this.showSettingsMenu = false;
				document.removeEventListener('click', this.outsideClickListener.bind(this));
			}
		},
	},
});
</script>
