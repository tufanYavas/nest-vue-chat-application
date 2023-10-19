<template>
	<div>
		<div id="wrapper">
			<div id="topbar" :style="{ 'background-color': settings.themeColor }">
				<div id="logo">
					<img :src="settings.logo" width="110" height="50" alt="Logo" />
				</div>

				<Status v-if="user" :currentStatus="user.status.name" />

				<Settings v-if="user" ref="settingsComponent" :user="user" @resetChat="messages.length = 0" />

				<div onclick="showPrivateMessages();" id="messagebox" class="pmboxmobile">
					<i class="fa fa-comments-o" aria-hidden="true"></i>
					<div class="messagecounter" id="messagecounter">0</div>
				</div>

				<div id="profile">
					<div @click="dos" id="messagebox">
						<i class="fa fa-comments-o" aria-hidden="true"></i>
						<div class="messagecounter" id="messagecounter">0</div>
					</div>
					<div class="profile-name">
						<span>{{ user?.username }}</span
						><br /><span class="small">
							{{ user?.rank.name }}
						</span>
					</div>
					<div class="profile-image">
						<input
							id="uploadfile"
							@change="uploadProfileImage"
							accept=".jpg, .jpeg, .png, .gif"
							type="file"
						/>

						<label for="uploadfile"
							><img :src="profileImagePath" width="46" height="46" :alt="user?.username"
						/></label>
					</div>
				</div>
			</div>

			<Left
				v-if="connection && user"
				v-model:user="user"
				v-model:currentRoom="connection.extra.room"
				v-model:usersInRoom="usersInRoom"
				v-model:usersInAllRooms="usersInAllRooms"
				v-model:isRightVisible="isRightVisible"
				@show-profileinfo="showProfileinfo"
			/>

			<transition name="slide-fade">
				<div
					id="right"
					v-show="isRightVisible"
					class="transparentbackground"
					:style="{
						'background-image': connection?.extra.room.bg ? `url(${connection?.extra.room.bg})` : 'none',
					}"
				>
					<div id="room">
						<div class="inner">
							<div id="roomname"></div>
							<div id="roomslogan"></div>
						</div>
					</div>

					<div id="chat" ref="chatContainer">
						<div v-for="(message, id) in messages" :key="id">
							<div
								v-if="message.data.type == 'SYSTEM_MESSAGE' || message.data.type == 'EVENT'"
								class="message"
							>
								<div class="centered-content">
									<div class="content">
										<div class="inner">
											<span class="bold">
												{{ message.data.text }}
												<a
													v-if="
														connection &&
														message.extra.user.rank.value <
															connection.extra.user.rank.value &&
														connection.extra.user.permission.canSeeIpOfUsers
													"
													style="color: blue"
													@click="whoIs(message.extra.user.username)"
												>
													{{ $t('Who is?') }}
												</a>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="send">
						<div class="inner">
							<input
								id="messageinput"
								autocomplete="off"
								type="text"
								placeholder="&#xf27b; Mesajınızı buraya yazın..."
							/>

							<div class="actions">
								<ul>
									<li id="actionmenu">
										<span id="mic" title="Mikrofon">
											<i id="micload" class="fa fa-microphone" aria-hidden="true"></i>
										</span>
										<!-- <span id="broadcast" title="Yayına Katıl">
								<i id="broadcastload" class="fas fa-broadcast-tower" aria-hidden="true"></i>
							</span> -->
										<span id="webcam" title="Kamera">
											<i id="webcamload" class="fa fa-video-camera" aria-hidden="true"></i>
										</span>
										<span id="mmute" title="Mikrofonu Sessiz'e al">
											<i class="fa fa-volume-off" aria-hidden="true"></i>
										</span>
										<span id="showAll" title="Menü">
											<i style="margin-top: 15px" class="fa fa-chevron-up" aria-hidden="true"></i>
										</span>
										<span class="showm">
											<span id="isend" title="Fotoğraf gönder">
												<form
													style="display: inline-block"
													onsubmit="return false;"
													id="iuploader"
													action=""
													method="post"
													enctype="multipart/form-data"
												>
													<label for="iupload">
														<i id="rowimage" class="fa fa-image" aria-hidden="true"></i>
														<input type="file" id="iupload" name="iupload" />
														<span class="show-xs">Resim gönder</span>
													</label>
												</form>
											</span>
											<span id="mrow" title="Mikrofon sırası">
												<i id="rowload" class="fa fa-hand-paper-o" aria-hidden="true"></i>
												<span class="show-xs">Mikrofon Sırası</span>
											</span>
											<span id="radiolabel" title="Radyo">
												<i id="radioload" class="fa fa-music" aria-hidden="true"></i>
												<span class="show-xs">Radyo</span>
											</span>
											<span id="record" title="Ses kaydı göndermek için basılı tutun">
												<i class="fa fa-file-audio-o" aria-hidden="true"></i>
												<span class="show-xs">Ses kaydı</span>
											</span>
											<span id="fonttype" title="Yazı tipiniz">
												<i class="fa fa-font"></i>
												<span class="show-xs">Yazı tipi</span>
											</span>
										</span>
									</li>
									<li>
										<div id="standalone" data-emoji-placeholder=":smiley:"></div>
									</li>
								</ul>
							</div>

							<button
								id="sendmsg"
								:style="{ 'background-color': settings.themeColor }"
								onclick="sendMessage();"
							>
								<i class="fa fa-paper-plane"></i>
							</button>
						</div>
					</div>
				</div>
			</transition>
		</div>

		<div id="lightbox" v-if="isLoading">
			<div id="loader">
				<img src="/assets/images/loader.gif" width="100" :alt="$t('Loading') + '...'" />
			</div>
		</div>

		<div id="alertbox"></div>

		<audio id="eb-sound" style="display: none" type="audio/ogg"></audio>
	</div>
</template>

<script lang="ts">
import StatusVue from '@/components/Status.vue';
import axios, { AxiosResponse } from 'axios';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { defineComponent } from 'vue';
import { IRoom, IUser } from '@/interfaces/server.interfaces';
import { Connection } from '@/rtc/connection';
import {
	IExtraData,
	IOnExtraDataUpdatedEvent,
	IOnMessageEvent,
	IOnOpenEvent,
	IRTCMultiConnection,
} from '@/interfaces/RTCMultiConnection';
import { SocketEventType } from '@/rtc/socket.enum';
import SettingsVue from '@/components/Settings.vue';
import { swalServerError } from '@/utils';
import LeftVue from '@/components/Left.vue';

export interface IUserForList extends IUser {
	room: IRoom;
	participantId: string;
}
export default defineComponent({
	name: 'Chat',
	components: {
		Status: StatusVue,
		Settings: SettingsVue,
		Left: LeftVue,
	},
	data(): {
		settings: { themeColor: string; logo: string };
		isLoading: boolean;
		user: IUser | null;
		connection: IRTCMultiConnection | null;
		messages: IOnMessageEvent[];
		usersInRoom: IUserForList[];
		usersInAllRooms: IUserForList[];
		isRightVisible: boolean;
	} {
		return {
			settings: {
				themeColor: '#000000',
				logo: 'logo.png',
			},
			isLoading: true,
			user: null,
			connection: null,
			messages: [],
			usersInRoom: [],
			usersInAllRooms: [],
			isRightVisible: true,
		};
	},
	props: {},
	methods: {
		dos() {},
		showProfileinfo(participantId: string) {
			if (this.connection!.userid == participantId) {
				if (this.connection!.extra.user.rank.value == 0) {
					Swal.fire({
						title: `<i class='fa fa-info-circle'></i> ${this.$t('Information')}`,
						icon: 'info',
						text: this.$t('Please sign up to edit your profile.'),
						showCancelButton: true,
						cancelButtonText: this.$t('Later'),
						confirmButtonText: this.$t('Sign up'),
						confirmButtonColor: '#d13131',
					}).then((result: SweetAlertResult) => {
						if (result.isConfirmed) {
							(this.$refs.settingsComponent as InstanceType<typeof SettingsVue>).showRegisterForm();
						}
					});
				} else {
					Swal.fire({
						title: `<i class='fa fa-user'></i> ${this.$t('Your Profile')}`,
						html: `
							<div id="profilesettings">
							<div id="_profileImage" class="profile-image"><img src="${this.profileImagePath}" height="120"
								alt="root" />
								<div class='placeholder'><i class='fa fa-cloud-upload' aria-hidden='true'></i></div>
							</div>
							<div class="profile-name">${this.user?.username}</div>
							<div class="form-group">
								<div class="swal2-label"><i class="fa fa-question-circle"></i>&nbsp;${this.$t('About Me')}:</div>
								<textarea class="swal2-textarea" id="aboutme" placeholder="${this.$t('Tell us briefly about yourself')}">${
							this.user?.about ?? ''
						}</textarea>
							</div>
							</div>
							<div class="form-group">
							<div class="swal2-label"><i class="fa fa-lock"></i>&nbsp;${this.$t('Current Password')}:</div>
							<input type="password" id="old-pass" placeholder="${this.$t('Current Password')}}" class="swal2-input">
							</div>
							<div class="form-group">
							<div class="swal2-label"><i class="fa fa-lock"></i>&nbsp;${this.$t('New Password')}:</div>
							<input type="password" id="new-pass" placeholder="${this.$t('New Password')}}" class="swal2-input">
							</div>
							</div>
							<h2><i class="fa fa-info-circle" aria-hidden="true"></i> ${this.$t('Preferences')}</h2>
							<div class="form-group">
							<div class="oo-switch"><span>${this.$t('Private Message')}</span></div>
							<div class="oo-switch2">
								<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="pmSwitch"
									${
										this.user?.preference.allowPrivateMessagesFromOthers ? 'checked' : ''
									}><label class="onoffswitch-label" for="pmSwitch"></label></div>
							</div>
							</div>
							<div class="form-group">
							<div class="oo-switch"><span>${this.$t('Voice Call')}</span></div>
							<div class="oo-switch2">
								<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="voiceCallSwitch"
									${
										this.user?.preference.allowVoiceCallsFromOthers ? 'checked' : ''
									}><label class="onoffswitch-label" for="voiceCallSwitch"></label></div>
							</div>
							</div>
							<div class="form-group">
							<div class="oo-switch"><span>${this.$t('Video Call')}</span></div>
							<div class="oo-switch2">
								<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="videoCallSwitch"
									${
										this.user?.preference.allowVideoCallsFromOthers ? 'checked' : ''
									}><label class="onoffswitch-label" for="videoCallSwitch"></label></div>
							</div>
							</div>
							<div class="form-group">
							<div class="oo-switch"><span>${this.$t('Notification Sounds')}</span></div>
							<div class="oo-switch2">
								<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="notificationSoundSwitch"
									${
										this.user?.preference.notificationEnabled ? 'checked' : ''
									}><label class="onoffswitch-label" for="notificationSoundSwitch"></label></div>
							</div>
							</div>
						`,
						showCancelButton: true,
						cancelButtonText: this.$t('Cancel'),
						confirmButtonText: 'Kaydet',
						confirmButtonColor: '#d13131',
						didOpen: () => {
							document!.getElementById('_profileImage')!.addEventListener('change', () => {
								document!.getElementById('uploadFile')!.click();
							});
						},
						preConfirm: () => {
							const aboutMeValue = (document.getElementById('aboutme') as HTMLInputElement).value;
							const oldPassValue = (document.getElementById('old-pass') as HTMLInputElement).value;
							const newPassValue = (document.getElementById('new-pass') as HTMLInputElement).value;
							const pmSwitchChecked = (document.getElementById('pmSwitch') as HTMLInputElement).checked;
							const voiceCallSwitchChecked = (
								document.getElementById('voiceCallSwitch') as HTMLInputElement
							).checked;
							const videoCallSwitchChecked = (
								document.getElementById('videoCallSwitch') as HTMLInputElement
							).checked;
							const notificationSoundSwitchChecked = (
								document.getElementById('notificationSoundSwitch') as HTMLInputElement
							).checked;

							const data: any = {
								about: aboutMeValue,
								allowPrivateMessagesFromOthers: pmSwitchChecked,
								allowVoiceCallsFromOthers: voiceCallSwitchChecked,
								allowVideoCallsFromOthers: videoCallSwitchChecked,
								notificationEnabled: notificationSoundSwitchChecked,
							};

							if (oldPassValue) {
								data.oldPassword = oldPassValue;
							}
							if (newPassValue) {
								data.newPassword = newPassValue;
							}

							return data;
						},
					})
						.then((result) => {
							if (result.isConfirmed) {
								axios
									.patch('/user/updateProfile', result.value)
									.then(async (response: any) => {
										this.user = response.data;
									})
									.catch((error: any) => {
										swalServerError(error);
									});
							}
						})
						.catch();
				}
			}
			this.connection!.socket.emit('get-remote-user-extra-data', participantId, (extra: IExtraData) => {
				console.log({ extra111111: extra });
			});
		},
		addUserToRoomList(newUser: IUserForList) {
			var user = this.usersInRoom.find((user) => user.participantId == newUser.participantId);
			if (user) {
				Object.assign(user, newUser); // update the user
			} else {
				this.usersInRoom.push(newUser);
			}
		},
		removeUserFromRoomList(participantId: string) {
			this.usersInRoom = this.usersInRoom.filter((user) => user.participantId !== participantId);
		},
		addUserToAllRoomsList(user: IUserForList) {},
		removeUserFromAllRoomsList(user: IUserForList) {},
		addMessage(newMessage: IOnMessageEvent) {
			console.log(
				newMessage.extra.user.rank.value < this.connection!.extra.user.rank.value &&
					this.connection!.extra.user.permission.canSeeIpOfUsers,
			);
			console.log({
				userRank: newMessage.extra.user.rank.value,
				myrank: this.connection!.extra.user.rank.value,
				permission: this.connection!.extra.user.permission.canSeeIpOfUsers,
			});
			this.messages.push(newMessage);
			if (this.messages.length > 200) {
				this.messages.shift();
			}
		},
		async uploadProfileImage(event: any) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append('file', file);

			await axios
				.post('/user/uploadProfileImage', formData)
				.then((response: AxiosResponse) => {
					this.user!.profileImage = response.data.profileImage;
				})
				.catch((error) => {
					swalServerError(error);
				});
		},
		whoIs(username: string) {
			this.connection?.socket.emit(SocketEventType.GET_IP, username);
		},
		setConnectionEvents() {
			if (!this.connection) return;

			this.connection.socket.on(SocketEventType.WHO_IS, (data: string) => {
				Swal.fire(this.$t('Who is?'), data, 'info');
			});
			this.connection.socket.on(SocketEventType.GET_IP, (data: string) => {
				Swal.fire(this.$t('IP Adress'), data, 'info');
			});
			this.connection.socket.on(SocketEventType.DOUBLE_LOGIN, (data: string) => {
				Swal.fire({
					title: `<i class='fa fa-close'></i> ! ${this.$t('Warning').toUpperCase()}} !`,
					text: this.$t(
						'You are now using the system through a different window. Please continue through the open window.',
					),
					allowOutsideClick: false,
					allowEscapeKey: false,
					showCancelButton: false,
					showConfirmButton: false,
					showCloseButton: false,
					confirmButtonText: this.$t('Reconnect'),
					confirmButtonColor: '#d13131',
				});
			});

			this.connection.onExtraDataUpdated = (event: IOnExtraDataUpdatedEvent) => {
				console.log('onExtraDataUpdated', { event });
				const userForList: IUserForList = {
					...event.extra.user,
					participantId: event.userid,
					room: event.extra.room,
				};
				this.addUserToRoomList(userForList);
			};

			this.connection.onopen = (event: IOnOpenEvent) => {
				console.log('onopen', { event });
				const userForList: IUserForList = {
					...event.extra.user,
					participantId: event.userid,
					room: event.extra.room,
				};
				this.addUserToRoomList(userForList);
			};

			// this.connection.onNewParticipant = (
			// 	participantId: any,
			// 	userPreferences: any,
			// ) => {
			// 	console.log('onNewParticipant', {
			// 		participantId,
			// 		userPreferences,
			// 	});
			// 	this.connection!.socket.emit(
			// 		'get-remote-user-extra-data',
			// 		participantId,
			// 		(extra: any) => {
			// 			console.log('onNewParticipant', { extra });
			// 			this.connection!.acceptParticipationRequest(
			// 				participantId,
			// 				userPreferences,
			// 			);
			// 		},
			// 	);
			// };
			this.connection.onleave = (event) => {
				console.log('onleave', { event });
				this.removeUserFromRoomList(event.userid);
				this.addMessage({
					...event,
					data: {
						text: `${event.extra.user.username} ${this.$t('leaved the room...')}`,
						type: 'EVENT',
					},
				});
			};
			this.connection.onmessage = (event) => {
				console.log('onmessage', { event });
				// events
				if (event.data.type == 'EVENT') {
					if (event.extra.room.id == this.connection!.extra.room.id && event.data.text == 'entered') {
						event.data.text = `${event.extra.user.username} ${this.$t('entered the room...')}`;
						this.addMessage(event);
					} else if (event.extra.room.id == this.connection!.extra.room.id && event.data.text == 'leaved') {
						event.data.text = `${event.extra.user.username} ${this.$t('leaved the room...')}`;
						this.addMessage(event);
					}
				}
			};
		},
	},
	mounted() {
		this.isLoading = false;
	},
	async created() {
		try {
			this.user = (await axios.get('/user/me')).data;
			this.connection = await Connection.getInstance();
			this.connection.extra.user = this.user!;
			const userForList: IUserForList = {
				...this.user!,
				participantId: this.connection.userid,
				room: this.connection.extra.room,
			};
			this.addUserToRoomList(userForList);
			this.setConnectionEvents();

			setTimeout(() => {
				this.connection!.send({ text: 'entered', type: 'EVENT' });
			}, 1000);
		} catch (error) {
			console.error(error);
		}
	},
	watch: {
		messages() {
			this.$nextTick(() => {
				const chatContainer = this.$refs.chatContainer as HTMLDivElement;
				chatContainer.scrollTop = chatContainer.scrollHeight;
			});
		},
	},
	computed: {
		profileImagePath(): string {
			if (this.user) {
				return this.user.profileImage
					? `uploads/images/${this.user.profileImage}`
					: `images/${this.user.gender ? 'man' : 'woman'}-profile.png`;
			}
			return '';
		},
	},
});
</script>

<style>
@import '@/assets/css/reset.css';
@import '@/assets/css/emojionearea.min.css';
@import '@/assets/css/jquery-ui.css';
@import '@/assets/css/style-chat.css';

@media (max-width: 768px) {
	.swal2-popup {
		width: 90% !important;
	}

	.swal2-input {
		font-size: 14px;
		padding: 10px !important;
	}

	.swal2-radio {
		margin-right: 5px;
	}

	.swal2-textarea {
		margin: 3px;
		padding-left: 7px !important;
	}
}
.oo-switch {
	width: 50%;
}
.oo-switch2 {
	width: 40%;
}
.centered-content {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
