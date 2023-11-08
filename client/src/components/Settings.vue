<template>
	<div id="settings">
		<i @click="toggleSettingsMenu" id="settingsOpener" class="fa fa-cog" aria-hidden="true"></i>
		<ul v-if="showSettingsMenu" id="settingsmenu">
			<a v-if="user.permission.canSeeAdminPanel" @click="showAdminPanel" :title="$t('Admin Panel')"
				><li>
					<i class="fa fa-hand-peace-o" aria-hidden="true"></i>
					{{ $t('Admin Panel') }}
				</li></a
			>
			<a
				v-if="user.rank.value > 0"
				@click.prevent="$emit('showProfileinfo', user.clientId)"
				title="Profil Ayarları"
				><li><i class="fa fa-user"></i> {{ $t('Profile Settings') }}</li></a
			>
			<a v-if="user.rank.value == 0" href="#" @click="showRegisterForm" :title="$t('Register')"
				><li><i class="fa fa-clipboard"></i> {{ $t('Register') }}</li></a
			>
			<a class="d-hidden" @click.prevent="$emit('showPrivateMessages')" :title="$t('Private Messages')"
				><li>
					<i class="fa fa-comments-o" aria-hidden="true"></i>
					{{ $t('Private Messages') }} ({{ unreadPrivateMessageCount }})
				</li></a
			>
			<a @click.prevent="showDeviceSettings" :title="$t('Show Device Settings')"
				><li><i class="fa fa-cog"></i> {{ $t('Show Device Settings') }}</li></a
			>
			<a v-if="user.permission.canSendToAll" href="#" @click="sendToAll"
				><li><i class="fa fa-comment"></i> {{ $t('Message to all') }}</li></a
			>
			<a href="#" @click.prevent="$emit('resetChat')"
				><li><i class="fa fa-times"></i> {{ $t('Delete messages') }}</li></a
			>
			<a v-if="user.permission.canResetChatForAll" href="#" @click="resetChatForAll"
				><li><i class="fa fa-users"></i> {{ $t('Delete all messages') }}</li></a
			>
			<a href="#"
				><li>
					<div>
						<div style="width: 100px" class="oo-switch">
							<i class="fa fa-cog"></i> {{ $t('Show system messages') }}
						</div>
						<div style="margin-top: 10px" class="oo-switch2">
							<div class="onoffswitch">
								<input
									type="checkbox"
									name="onoffswitch"
									class="onoffswitch-checkbox"
									id="showSystemMessages"
									checked
									@change="showSystemMessagesChanged"
								/>
								<label class="onoffswitch-label" for="showSystemMessages"></label>
							</div>
						</div>
					</div></li
			></a>

			<a @click.prevent="logout" :title="$t('Logout')"
				><li><i class="fa fa-sign-out"></i> {{ $t('Logout') }}</li></a
			>
		</ul>
	</div>
</template>

<script lang="ts">
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';
import { IUserForClient } from '@/types';
import { SocketEventType } from '@/socket/socket.enum';

export default defineComponent({
	name: 'Settings',
	data(): {
		showSettingsMenu: boolean;
		videoDevices: MediaDeviceInfo[];
		audioDevices: MediaDeviceInfo[];
	} {
		return {
			showSettingsMenu: false,
			videoDevices: [],
			audioDevices: [],
		};
	},
	props: {
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
		unreadPrivateMessageCount: {
			type: Number,
			required: true,
		},
	},
	emits: ['resetChat', 'updateUser', 'showProfileinfo', 'showPrivateMessages', 'sendToAll', 'showAdminPanel'],
	methods: {
		showAdminPanel() {
			if (this.user.permission.canSeeAdminPanel) {
				this.$emit('showAdminPanel');
			}
		},
		showSystemMessagesChanged(event: Event) {
			window.showSystemMessages = (event.target as HTMLInputElement).checked;
		},
		showDeviceSettings() {
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					const cameras = devices.filter((device) => device.kind === 'videoinput');
					const microphones = devices.filter((device) => device.kind === 'audioinput');

					cameras.push({ deviceId: 'none', label: this.$t('No Camera') } as MediaDeviceInfo);
					microphones.push({ deviceId: 'none', label: this.$t('No Microphone') } as MediaDeviceInfo);

					let cameraOptions = cameras
						.map((camera) => {
							return `<option value="${camera.deviceId}" ${
								window.selectedCameraId === camera.deviceId ? 'selected' : ''
							}>${camera.label || 'Kamera'}</option>`;
						})
						.join('');

					let microphoneOptions = microphones
						.map((microphone) => {
							return `<option value="${microphone.deviceId}" ${
								window.selectedMicrophoneId === microphone.deviceId ? 'selected' : ''
							}>${microphone.label || 'Mikrofon'}</option>`;
						})
						.join('');

					Swal.fire({
						title: this.$t('Device Selection'),
						html: `<div class="form-group">
							<div class="swal2-label"><i class="fa fa-microphone"></i>&nbsp;${this.$t('Microphone')}:</div>
							<select id="swal-camera-select" class="swal2-input">${cameraOptions}</select>
							</div>
							<br>
							<div class="form-group">
							<div class="swal2-label"><i class="fa fa-video-camera"></i>&nbsp;${this.$t('Camera')}:</div>
							<select id="swal-microphone-select" class="swal2-input">${microphoneOptions}</select>
							</div>`,
						confirmButtonColor: '#0f1012',
						focusConfirm: false,
						preConfirm: () => {
							return [
								(document.getElementById('swal-camera-select') as HTMLInputElement).value,
								(document.getElementById('swal-microphone-select') as HTMLInputElement).value,
							];
						},
					}).then((result) => {
						if (result.value) {
							window.selectedCameraId = result.value[0];
							window.selectedMicrophoneId = result.value[1];
						}
					});
				})
				.catch(function (err) {
					console.error('Cihazları listelerken bir hata oluştu:', err);
				});
		},
		async logout() {
			await axios.post('/auth/signout');
			this.$router.push('/login');
		},
		resetChatForAll() {
			this.$socket.emit(SocketEventType.RESET_CHAT_FOR_ALL);
		},
		sendToAll() {
			Swal.fire({
				title: this.$t('Message to all rooms'),
				input: 'text',
				inputLabel: this.$t('Message'),
				inputPlaceholder: this.$t('Write your message'),
				inputAttributes: {
					'aria-label': this.$t('Write your message'),
				},
				showCancelButton: true,
				confirmButtonText: this.$t('Send'),
				cancelButtonText: this.$t('Cancel'),
				confirmButtonColor: '#0f1012',
				inputValidator: (value) => {
					if (!value) {
						return this.$t('Cannot send empty message');
					}
				},
			}).then((result) => {
				if (result.isConfirmed) {
					this.$emit('sendToAll', result.value);
				}
			});
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
									this.$emit('updateUser', response.data);
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
