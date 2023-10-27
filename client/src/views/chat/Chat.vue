<template>
	<div>
		<div id="wrapper">
			<!-- fake inputs for browser auto complete -->
			<input type="text" name="fake-username" autocomplete="off" style="display: none" />
			<input type="password" name="fake-password" autocomplete="off" style="display: none" />

			<div id="topbar" :style="{ 'background-color': settings.themeColor }">
				<div id="logo">
					<img :src="settings.logo" width="110" height="50" alt="Logo" />
				</div>

				<Status v-if="user" v-model:currentStatus="user.status" />

				<Settings v-if="user" ref="settingsComponent" v-model:user="user" @resetChat="messages.length = 0" />

				<div @click="showPrivateMessages" id="messagebox" class="pmboxmobile">
					<i class="fa fa-comments-o" aria-hidden="true"></i>
					<div class="messagecounter" id="messagecounter">{{ unreadPrivateMessageCount }}</div>
				</div>

				<div id="profile">
					<div @click="showPrivateMessages" id="messagebox">
						<i class="fa fa-comments-o" aria-hidden="true"></i>
						<div class="messagecounter" id="messagecounter">{{ unreadPrivateMessageCount }}</div>
					</div>
					<div class="profile-name">
						<span>{{ user?.username }}</span
						><br /><span class="small">
							{{ user?.rank.name }}
						</span>
					</div>
					<div class="profile-image" @click="uploadProfileImageClick">
						<input
							id="uploadfile"
							@change="uploadImage($event, 'PROFILE_IMAGE')"
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
				v-if="user"
				ref="leftContainer"
				:rooms="rooms"
				:privateMessages="privateMessages"
				v-model:user="user"
				v-model:allUsers="allUsers"
				v-model:isRightVisible="isRightVisible"
				v-model:isPrivateChatVisible="isPrivateChatVisible"
				@privateChatStarted="privateChattingUser = $event"
				@clearRoomMessages="messages.length = 0"
			/>

			<transition name="slide">
				<div
					id="right"
					v-show="isRightVisible"
					class="transparentbackground"
					:class="{ 'private-bg': isPrivateChatVisible }"
					:style="{
						'background-image': !user ? 'none' : user.room.bg ? `url(${user.room.bg})` : 'none',
					}"
				>
					<div id="room">
						<div class="inner">
							<div id="roomname">
								{{
									(isPrivateChatVisible && privateChattingUser
										? privateChattingUser.username
										: user?.room.name) + ' |&nbsp;'
								}}
							</div>
							<div id="roomslogan">
								<span
									v-if="isPrivateChatVisible"
									class="back-to-room"
									style="cursor: pointer"
									@click="isPrivateChatVisible = false"
									><i class="fa fa-arrow-left"></i>&nbsp;{{ $t('Back To Room') }}</span
								>
								<span v-else>{{ user?.room.slogan }}</span>
							</div>
						</div>
					</div>

					<ChatMessageArea v-if="user" :messages="messages" :user="user" v-show="!isPrivateChatVisible" />

					<ChatMessageArea
						v-if="user && privateChattingUser"
						:messages="privateMessages[privateChattingUser.clientId] ?? []"
						:user="user"
						v-show="isPrivateChatVisible"
					/>

					<div id="send">
						<div class="inner">
							<input
								@keyup.enter="sendMessage()"
								autocomplete="off"
								type="text"
								placeholder="&#xf27b; Mesajınızı buraya yazın..."
								v-model="message"
							/>

							<div class="actions">
								<ul>
									<li id="actionmenu">
										<span id="mic" title="Mikrofon" ref="aa" @click="dod">
											<i id="micload" class="fa fa-smile-o" aria-hidden="true"></i>
										</span>
										<span id="mic" title="Mikrofon">
											<i id="micload" class="fa fa-microphone" aria-hidden="true"></i>
										</span>
										<span id="broadcast" title="Yayına Katıl">
											<i id="broadcastload" class="fas fa-broadcast-tower" aria-hidden="true"></i>
										</span>
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
											<span :title="$t('Send Image')">
												<label for="iupload">
													<i class="fa fa-image" aria-hidden="true"></i>
													<input
														@change="uploadImage($event, 'CHAT_IMAGE')"
														accept=".jpg, .jpeg, .png, .gif"
														type="file"
														id="iupload"
														name="iupload"
													/>
													<span class="show-xs">{{ $t('Send Image') }}</span>
												</label>
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
											<span :title="$t('Change font')">
												<i class="fa fa-font"></i>
												<span class="show-xs">{{ $t('Change font') }}</span>
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
								@click="sendMessage()"
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
				<img src="images/loader.gif" width="100" :alt="$t('Loading') + '...'" />
			</div>
		</div>

		<div id="alertbox" v-show="isAlertBoxVisible">{{ alertMessage }}</div>

		<audio id="eb-sound" style="display: none" type="audio/ogg"></audio>
	</div>
</template>

<script lang="ts">
import StatusVue from '@/components/Status.vue';
import axios, { AxiosResponse } from 'axios';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Ref, defineComponent, ref } from 'vue';
import { IRoom, ISendMessage, IUser, IUserForClient } from '@/interfaces/server.interfaces';
import { SocketEventType } from '@/socket/socket.enum';
import SettingsVue from '@/components/Settings.vue';
import { getProfileImagePath, swalServerError } from '@/utils';
import LeftVue from '@/components/Left.vue';
import ChatMessageAreaVue from '@/components/ChatMessageArea.vue';
import { EmojiButton } from '@joeattardi/emoji-button';

export default defineComponent({
	name: 'Chat',
	components: {
		Status: StatusVue,
		Settings: SettingsVue,
		Left: LeftVue,
		ChatMessageArea: ChatMessageAreaVue,
	},
	data(): {
		settings: { themeColor: string; logo: string };
		isLoading: boolean;
		messages: ISendMessage[];
		allUsers: IUserForClient[];
		isRightVisible: boolean;
		message: string;
		rooms: IRoom[];
		user: IUserForClient | null;
		unreadPrivateMessageCount: number;
		isPrivateChatVisible: boolean;
		privateChattingUser: IUserForClient | undefined;
		privateMessages: Ref<Record<string, ISendMessage[]>>;
		alertMessage: string;
		isAlertBoxVisible: boolean;
		picker: EmojiButton;
	} {
		return {
			settings: {
				themeColor: '#000000',
				logo: 'logo.png',
			},
			isLoading: true,
			messages: [],
			allUsers: [],
			isRightVisible: true,
			message: '',
			rooms: [],
			user: null,
			unreadPrivateMessageCount: 0,
			isPrivateChatVisible: false,
			privateChattingUser: undefined,
			privateMessages: ref<Record<string, ISendMessage[]>>({}),
			alertMessage: '',
			isAlertBoxVisible: false,
			picker: new EmojiButton({ autoHide: false, twemojiOptions: true }),
		};
	},
	props: {},
	methods: {
		dod() {
			this.picker.togglePicker(this.$refs.aa as HTMLElement);
		},
		showAlertMessage(message: string) {
			this.alertMessage = message;
			this.isAlertBoxVisible = true;
			// TODO if notifications allowed ring sound
			setTimeout(() => {
				this.isAlertBoxVisible = false;
			}, 3000);
		},
		showPrivateMessages() {
			this.unreadPrivateMessageCount = 0;
			(this.$refs.leftContainer as InstanceType<typeof LeftVue>).showPrivateMessages();
		},
		sendMessage(
			contentType: ISendMessage['contentType'] = undefined,
			contentPath: ISendMessage['contentType'] = undefined,
		) {
			const message: ISendMessage = {
				user: this.user!,
				text: this.message.trim(),
				type: this.isPrivateChatVisible ? 'PRIVATE_MESSAGE' : 'ROOM_MESSAGE',
				to:
					this.isPrivateChatVisible && this.privateChattingUser
						? this.privateChattingUser.clientId
						: undefined,
				contentType,
				contentPath,
			};

			console.log({ message, length: message.text.length, contentType });
			if (contentType !== 'IMAGE') this.message = '';

			if (!message.text.length && !contentType) return;
			this.$socket.emit(SocketEventType.SEND_MESSAGE, message);
			console.log('emit');
			if (message.type == 'PRIVATE_MESSAGE') {
				this.addPrivateMessage(message);
			}
		},
		syncUsers(users: IUserForClient[]) {
			this.allUsers = this.allUsers.filter((roomUser) =>
				users.some((user) => user.clientId === roomUser.clientId),
			);

			users.forEach((user) => {
				this.upsertUser(user);
			});
		},
		upsertUser(newUser: IUserForClient) {
			var user = this.allUsers.find((user) => user.clientId == newUser.clientId);
			if (user) {
				Object.assign(user, newUser); // update the user
				if (this.user) Object.assign(this.user, event);
			} else {
				this.allUsers.push(newUser);
			}
		},
		addPrivateMessage(message: ISendMessage) {
			if (!this.privateMessages[message.user.clientId]) this.privateMessages[message.user.clientId] = [];
			this.privateMessages[message.user.clientId].push(message);
			if (this.privateMessages[message.user.clientId].length > 200) {
				this.privateMessages[message.user.clientId].shift();
			}

			if (!this.isPrivateChatVisible) {
				this.unreadPrivateMessageCount++;
				this.showAlertMessage(`${message.user.username} ${this.$t('sent a private message')}`);
			}
		},
		removeUser(clientId: string) {
			this.allUsers = this.allUsers.filter((user) => user.clientId !== clientId);
		},
		addMessage(newMessage: ISendMessage) {
			this.messages.push(newMessage);
			if (this.messages.length > 200) {
				this.messages.shift();
			}
		},

		async uploadProfileImageClick(event: any) {
			if (this.user?.rank.value === 0) {
				event.preventDefault();
				return Swal.fire(this.$t('Info'), this.$t("Guests can't change profile image"), 'info');
			}
		},
		async uploadImage(event: any, type: 'PROFILE_IMAGE' | 'CHAT_IMAGE') {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append('file', file);
			const url = type == 'PROFILE_IMAGE' ? '/user/uploadProfileImage' : '/message/uploadChatImage';
			await axios
				.post(url, formData)
				.then((response: AxiosResponse) => {
					if (type === 'PROFILE_IMAGE') {
						this.user!.profileImage = response.data.profileImage;
					} else if (type === 'CHAT_IMAGE') {
						const imagePath = response.data.imagePath;
						this.sendMessage('IMAGE', imagePath);
					}
				})
				.catch((error) => {
					swalServerError(error);
				});
		},
		setConnectionEvents() {
			this.$socket.on(SocketEventType.UPDATE_EXTRA_DATA, (event: IUserForClient) => {
				console.log(SocketEventType.UPDATE_EXTRA_DATA, event);
				this.upsertUser(event);
			});
			this.$socket.on(SocketEventType.GET_IP, (data: string) => {
				Swal.fire(this.$t('IP Adress'), data, 'info');
			});
			this.$socket.on(SocketEventType.DOUBLE_LOGIN, (data: string) => {
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
			this.$socket.on(SocketEventType.USER_CONNECTED, (user: IUserForClient) => {
				console.log(SocketEventType.USER_CONNECTED, { user });
				this.upsertUser(user);
			});
			this.$socket.on(SocketEventType.USER_DISCONNECTED, (clientId: string) => {
				console.log(SocketEventType.USER_DISCONNECTED, { clientId });
				this.removeUser(clientId);
			});
			this.$socket.on(SocketEventType.GET_ALL_USERS, (users: IUserForClient[]) => {
				console.log(SocketEventType.GET_ALL_USERS, { users });
				this.syncUsers(users);
			});
			this.$socket.on(SocketEventType.SEND_MESSAGE, (event: ISendMessage) => {
				console.log(SocketEventType.SEND_MESSAGE, { event });
				if (event.type == 'ROOM_EVENT') {
					if (event.user.room.id == this.user?.room.id && event.text == 'entered') {
						event.text = `${event.user.username} ${this.$t('entered the room...')}`;
						this.addMessage(event);
					} else if (event.user.room.id == this.user?.room.id && event.text == 'leaved') {
						event.text = `${event.user.username} ${this.$t('leaved the room...')}`;
						this.addMessage(event);
					}
				} else if (event.type == 'ROOM_MESSAGE') {
					this.messages.push(event);
				} else if (event.type == 'PRIVATE_MESSAGE') {
					this.addPrivateMessage(event);
				}
			});
		},
	},
	async mounted() {
		try {
			const _user = (await axios.get('/user/me')).data;
			this.rooms = (await axios.get('/room')).data;

			if (this.$socket.connected) {
				this.$socket.disconnect();
			}
			this.$socket.auth = { username: _user?.username };

			this.$socket.on(SocketEventType.SET_USER_DATA, (event: IUserForClient) => {
				console.log(SocketEventType.SET_USER_DATA, { event });
				this.user = event;
				this.setConnectionEvents();
				this.isLoading = false;

				this.$socket.emit(SocketEventType.GET_ALL_USERS);
			});
			this.$socket.connect();
		} catch (error) {
			console.error(error);
		}
	},
	async created() {
		this.picker.on('emoji', (selection) => {
			this.message += selection.emoji;
		});
	},
	watch: {
		user: {
			handler(user) {
				console.log('update user', { user: this.user });
				this.$socket.emit(SocketEventType.UPDATE_EXTRA_DATA, this.user);
			},
			deep: true,
		},
	},
	computed: {
		profileImagePath(): string {
			return getProfileImagePath(this.user!);
		},
	},
});
</script>

<style>
@import '@/assets/css/reset.css';
/*@import '@/assets/css/emojionearea.min.css';*/
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
