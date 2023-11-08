<template>
	<div>
		<AdminPanel v-if="isAdminPanelVisible && user" @closeAdminPanel="isAdminPanelVisible = false" :user="user" />
		<div id="wrapper">
			<!-- fake inputs for browser auto complete -->
			<input type="text" name="fake-username" autocomplete="off" style="display: none" />
			<input type="password" name="fake-password" autocomplete="off" style="display: none" />

			<div id="topbar" :style="{ 'background-color': settings.themeColor }">
				<div id="logo">
					<img :src="settings.logo" width="110" height="50" alt="Logo" />
				</div>

				<Status v-if="user" v-model:currentStatus="user.status" />

				<Settings
					v-if="user"
					ref="settingsComponent"
					:user="user"
					:unreadPrivateMessageCount="unreadPrivateMessageCount"
					@resetChat="resetChat"
					@showProfileinfo="showProfileinfo($event)"
					@showPrivateMessages="showPrivateMessages"
					@sendToAll="sendMessage({ messageType: 'ALL_MESSAGE', text: $event })"
					@showAdminPanel="showAdminPanel"
					@updateUser="Object.assign(user, $event)"
				/>

				<div @click="showPrivateMessages" id="messagebox" class="pmboxmobile">
					<i class="far fa-comments" aria-hidden="true"></i>
					<div class="messagecounter" id="messagecounter">{{ unreadPrivateMessageCount }}</div>
				</div>

				<div id="profile">
					<div @click="showPrivateMessages" id="messagebox">
						<i class="far fa-comments" aria-hidden="true"></i>
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
				ref="left"
				:rooms="rooms"
				:privateMessages="privateMessages"
				:settings="settings"
				v-model:user="user"
				v-model:allUsers="allUsers"
				v-model:isRightVisible="isRightVisible"
				v-model:isPrivateChatVisible="isPrivateChatVisible"
				@privateChatStarted="privateChattingUser = $event"
				@clearRoomMessages="messages.length = 0"
				@call="call($event)"
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
									((isPrivateChatVisible && privateChattingUser
										? privateChattingUser.username
										: user?.room.name) ?? '') + ' |&nbsp;'
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
								id="message-input"
								@keyup.enter="sendMessage()"
								autocomplete="off"
								type="text"
								:placeholder="$t('Write your message here...')"
								v-model="message"
							/>

							<div class="actions">
								<ul>
									<li id="actionmenu">
										<span title="Emoji" ref="emojiElement" @click="emojiClicked">
											<i class="fa fa-smile-o" aria-hidden="true"></i>
										</span>
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
											</label>
										</span>
										<span :title="$t('Change font')" @click="changeFont">
											<i class="fa fa-font"></i>
										</span>
									</li>
								</ul>
							</div>

							<button :style="{ 'background-color': settings.themeColor }" @click="sendMessage()">
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
		<BroadcastManager
			v-if="user"
			ref="broadcastManager"
			:user="user"
			@conversationOver="showAlertMessage($t('The conversation is over'))"
		/>
	</div>
</template>

<script lang="ts">
import StatusVue from '@/components/Status.vue';
import axios, { AxiosResponse } from 'axios';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Ref, defineComponent, ref } from 'vue';
import { Call, IRoom, ISendMessage, ISettings, IUser, IUserForClient, MessageType } from '@/types';
import { SocketEventType } from '@/socket/socket.enum';
import SettingsVue from '@/components/Settings.vue';
import { getProfileImagePath, swalServerError } from '@/utils';
import LeftVue from '@/components/Left.vue';
import ChatMessageAreaVue from '@/components/ChatMessageArea.vue';
import { EmojiButton } from '@joeattardi/emoji-button';
import BroadcastManager from '@/components/BroadcastManager.vue';
import AdminPanelVue from '@/components/admin/AdminPanel.vue';

export default defineComponent({
	name: 'Chat',
	components: {
		Status: StatusVue,
		Settings: SettingsVue,
		Left: LeftVue,
		ChatMessageArea: ChatMessageAreaVue,
		BroadcastManager: BroadcastManager,
		AdminPanel: AdminPanelVue,
	},
	data(): {
		settings: ISettings;
		isLoading: boolean;
		messages: ISendMessage[];
		allUsers: IUserForClient[];
		isRightVisible: boolean;
		message: string;
		rooms: IRoom[];
		user: IUserForClient | null;
		unreadPrivateMessageCount: number;
		isPrivateChatVisible: boolean;
		isAdminPanelVisible: boolean;
		privateChattingUser: IUserForClient | undefined;
		privateMessages: Ref<Record<string, ISendMessage[]>>;
		alertMessage: string;
		isAlertBoxVisible: boolean;
		picker: EmojiButton;
	} {
		return {
			settings: {} as ISettings,
			isLoading: true,
			messages: [],
			allUsers: [],
			isRightVisible: true,
			message: '',
			rooms: [],
			user: null,
			unreadPrivateMessageCount: 0,
			isPrivateChatVisible: false,
			isAdminPanelVisible: false,
			privateChattingUser: undefined,
			privateMessages: ref<Record<string, ISendMessage[]>>({}),
			alertMessage: '',
			isAlertBoxVisible: false,
			picker: new EmojiButton({ autoHide: false, twemojiOptions: true }),
		};
	},
	provide() {
		return {
			uploadImage: this.uploadImage,
		};
	},
	methods: {
		changeFont() {
			Swal.fire({
				title: `<i class='fa fa-edit'></i> ${this.$t('Edit rank')}`,
				html: `
				<div class="slidecontainer">
					<label><i class="fa fa-caret-right"></i> Yazı boyutu (<span id="fonttext">10</span>pt)</label>
					<input type="range" min="9" max="18" value="10" class="slider" id="fontSize"></div>
				<div>
					<label><i class="fa fa-caret-right"></i> Yazı rengi</label>
					<input type="color" id="fontColor" value="#000000">
				</div>
						`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: this.$t('Save'),
				confirmButtonColor: '#0f1012',
				preConfirm: () => {
					return {
						fontSize: (document.getElementById('fontSize') as HTMLInputElement).value,
						fontColor: (document.getElementById('fontColor') as HTMLInputElement).value,
					};
				},
			})
				.then((result) => {
					if (result.isConfirmed) {
						// axios
						// 	.patch(`/admin/updateRank/${rank.id}`, result.value)
						// 	.then(this.getRanks)
						// 	.catch((error: any) => {
						// 		swalServerError(error);
						// 	});
					}
				})
				.catch();
		},
		async logout() {
			await axios.post('/auth/signout');
			this.$router.push('/login');
		},
		showAdminPanel() {
			this.isAdminPanelVisible = true;
		},
		resetChat() {
			this.messages.length = 0;
		},
		emojiClicked() {
			this.picker.togglePicker(this.$refs.emojiElement as HTMLElement);
		},
		showProfileinfo(clientId: string) {
			(this.$refs.left as InstanceType<typeof LeftVue>).showProfileinfo(clientId);
		},
		call(call: Call) {
			(this.$refs.broadcastManager as InstanceType<typeof BroadcastManager>).startCall(call);
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
			(this.$refs.left as InstanceType<typeof LeftVue>).showPrivateMessages();
		},
		sendMessage(
			options: {
				text?: string;
				contentType?: ISendMessage['contentType'];
				contentPath?: ISendMessage['contentType'];
				messageType?: MessageType;
			} = {},
		) {
			const message: ISendMessage = {
				user: this.user!,
				text: options.text ?? this.message.trim(),
				type: options.messageType ?? (this.isPrivateChatVisible ? 'PRIVATE_MESSAGE' : 'ROOM_MESSAGE'),
				toClientId:
					this.isPrivateChatVisible && this.privateChattingUser
						? this.privateChattingUser.clientId
						: undefined,
				contentType: options.contentType,
				contentPath: options.contentPath,
			};

			if (options.contentType !== 'IMAGE') this.message = '';

			if (!message.text.length && !options.contentType) return;
			this.$socket.emit(SocketEventType.SEND_MESSAGE, message);
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
		async uploadImage(
			event: any,
			type: 'PROFILE_IMAGE' | 'CHAT_IMAGE' | 'ADMIN_PROFILE_IMAGE_UPDATE',
			id: number | undefined = undefined,
			cb: ((profileImage: string) => void) | undefined = undefined,
		) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append('file', file);
			const url = id
				? `/admin/uploadProfileImage/${id}`
				: type == 'PROFILE_IMAGE'
				? '/user/uploadProfileImage'
				: '/message/uploadChatImage';
			await axios
				.post(url, formData)
				.then((response: AxiosResponse) => {
					if (cb) cb(response.data.profileImage);
					else if (type === 'PROFILE_IMAGE') {
						this.user!.profileImage = response.data.profileImage;
					} else if (type === 'CHAT_IMAGE') {
						const imagePath = response.data.imagePath;
						this.sendMessage({ contentType: 'IMAGE', contentPath: imagePath });
					}
				})
				.catch((error) => {
					swalServerError(error);
				});
		},
		setConnectionEvents() {
			this.$socket.on(SocketEventType.ROOM_UPDATED, (room: IRoom) => {
				if (!room.name) {
					// deleted
					this.rooms = this.rooms.filter((r) => r.id !== room.id);
				} else {
					const r = this.rooms.find((r) => r.id === room.id);
					if (!r) {
						// created
						this.rooms.push(room);
					} else {
						// updated
						Object.assign(r, room);
					}
				}
				this.rooms = this.rooms.sort((a: IRoom, b: IRoom) => a.row - b.row);
			});
			this.$socket.on(SocketEventType.USER_UPDATED, (user: IUser) => {
				if (user.id === this.user?.id) {
					Object.assign(this.user, user);
					if (this.user.banned) this.logout();
				}
			});
			this.$socket.on(SocketEventType.SETTINGS_UPDATED, (settings: ISettings) => {
				this.settings = settings;
			});
			this.$socket.on(SocketEventType.UPDATE_EXTRA_DATA, (event: IUserForClient) => {
				this.upsertUser(event);
			});
			this.$socket.on(SocketEventType.GET_IP, (data: string) => {
				Swal.fire(this.$t('IP Adress'), data, 'info');
			});
			this.$socket.on(SocketEventType.RESET_CHAT_FOR_ALL, (data: string) => {
				this.resetChat();
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
					confirmButtonColor: '#0f1012',
				});
			});
			this.$socket.on(SocketEventType.USER_CONNECTED, (user: IUserForClient) => {
				this.upsertUser(user);
			});
			this.$socket.on(SocketEventType.USER_DISCONNECTED, (clientId: string) => {
				this.removeUser(clientId);
			});
			this.$socket.on(SocketEventType.GET_ALL_USERS, (users: IUserForClient[]) => {
				this.syncUsers(users);
			});
			this.$socket.on(SocketEventType.SEND_MESSAGE, (event: ISendMessage) => {
				if (
					(event.type === 'ROOM_EVENT' || event.type === 'ALL_EVENT' || event.type === 'SYSTEM_MESSAGE') &&
					!window.showSystemMessages
				) {
					return;
				} else if (event.type == 'ROOM_EVENT') {
					if (event.user.room.id == this.user?.room.id && event.text == 'entered') {
						event.text = `${event.user.username} ${this.$t('entered the room...')}`;
						this.addMessage(event);
					} else if (event.user.room.id == this.user?.room.id && event.text == 'leaved') {
						event.text = `${event.user.username} ${this.$t('leaved the room...')}`;
						this.addMessage(event);
					}
					this.messages.push(event);
				} else if (event.type == 'PRIVATE_MESSAGE') {
					this.addPrivateMessage(event);
				} else {
					this.messages.push(event);
				}
			});
		},
	},
	async mounted() {
		try {
			const _user = (await axios.get('/user/me')).data;
			this.rooms = (await axios.get('/room')).data.sort((a: IRoom, b: IRoom) => a.row - b.row);
			this.settings = (await axios.get('/settings')).data;
			document.title = this.settings.title;

			if (this.$socket.connected) {
				this.$socket.disconnect();
			}
			this.$socket.auth = { username: _user?.username, gender: _user?.gender };

			this.$socket.on(SocketEventType.SET_USER_DATA, (event: IUserForClient) => {
				this.user = event;
				this.setConnectionEvents();
				this.isLoading = false;

				this.$socket.emit(SocketEventType.GET_ALL_USERS);
			});
			this.$socket.connect();
		} catch (error) {
			this.logout();
		}
	},
	async created() {
		this.picker.on('emoji', (selection) => {
			this.message += selection.emoji;
		});
	},
	unmounted() {
		this.$socket.removeAllListeners();
	},
	beforeDestroy() {
		this.$socket.removeAllListeners();
	},
	watch: {
		user: {
			handler(user) {
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
