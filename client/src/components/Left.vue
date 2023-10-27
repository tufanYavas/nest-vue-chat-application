<template>
	<div id="left">
		<div id="roominfo">
			<div id="selection">
				<ul>
					<li
						id="showChat"
						@click="showChat"
						class="md-hidden"
						:class="{
							'm-active': activeTab === 'CHAT' && isMobile,
						}"
					>
						<i class="fa fa-commenting" aria-hidden="true"></i>
						{{ $t('Chat') }}
					</li>
					<li
						id="showRooms"
						@click="showRooms"
						:class="{
							active: activeTab === 'ROOMS' && !isMobile,
							'm-active': activeTab === 'ROOMS' && isMobile,
						}"
					>
						<i class="fa fa-telegram" aria-hidden="true"></i>
						{{ $t('Rooms') }}
					</li>
					<li
						id="showAllUsers"
						@click="showAllUsers"
						:class="{
							active: activeTab === 'ALLUSERS' && !isMobile,
							'm-active': activeTab === 'ALLUSERS' && isMobile,
						}"
					>
						<i class="fa fa-users"></i> {{ $t('All Users') }} (<span style="cursor: pointer" id="whole">{{
							allUsersLength
						}}</span
						>)
					</li>
					<li
						id="showUsers"
						@click="showUsers"
						:class="{
							active: activeTab === 'USERS' && !isMobile,
							'm-active': activeTab === 'USERS' && isMobile,
						}"
					>
						<i class="fa fa-users"></i> {{ $t('Users') }} (<span style="cursor: pointer" id="wholeroom">{{
							roomUsersLength
						}}</span
						>)
					</li>
				</ul>
			</div>

			<transition-group name="slide">
				<div id="roomlist" key="0" v-show="isRoomListVisible">
					<i style="margin: 0 0 0 10px" class="fa fa-search"></i
					><input
						class="search"
						id="roomsearch"
						type="text"
						v-model="searchRoomText"
						:placeholder="$t('Search Room')"
					/>

					<div
						v-for="room in filteredRooms"
						:key="room.id"
						class="room"
						:class="{ active: room.id == user.room.id }"
						@click="joinRoom(room)"
					>
						<div class="name"><i class="fa fa-comment-o" aria-hidden="true"></i> {{ room.name }}</div>
						<div class="online">
							<i v-if="room.hasPassword" class="fa fa-lock">&nbsp;</i>
							<i class="fa fa-group">&nbsp;</i>
							<span class="roomCount" :data-name="room.name">{{ roomUserCounts[room.id] ?? 0 }}</span>
						</div>
					</div>
				</div>

				<div id="userlist" key="1" v-show="isUserListVisible">
					<i style="margin: 0 0 0 10px" class="fa fa-search"></i
					><input
						class="search"
						id="usersearch"
						autocomplete="off"
						v-model="searchUsersText"
						type="text"
						:placeholder="$t('Search in room')"
					/>

					<div v-for="u in filteredUsers" :key="u.username" @click="showProfileinfo(u.clientId)" class="user">
						<div class="image">
							<img style="cursor: pointer" :src="getProfileImagePath(u)" height="50" :alt="u.username" />
						</div>
						<div class="info">
							<div class="name">{{ u.username }}</div>
							<div class="status">
								{{ u.rank.name }}
								<i v-if="u.rank.value == 0" class="fa fa-question-circle-o"></i>
								<i v-else-if="u.rank.value == 1" class="fa fa-user"></i>
								<i v-else v-for="i in u.rank.value - 1" :key="i" class="fa fa-star"></i>
							</div>
							<div class="text">{{ u.status.name }}</div>
						</div>
						<div class="icons">
							<div style="visibility: hidden" class="icon">
								<i class="fa fa-hand-paper-o"></i>
							</div>
							<div style="visibility: hidden" class="icon">
								<i style="font-size: 15pt" class="fa fa-mobile"></i>
							</div>
							<div class="icon">
								<i class="fa fa-microphone"></i>
							</div>
							<div class="icon">
								<i class="fa fa-video-camera"></i>
							</div>
						</div>
					</div>
				</div>
				<div id="alluserlist" key="2" v-show="isAllUserListVisible">
					<i style="margin: 0 0 0 10px" class="fa fa-search"></i
					><input
						class="search"
						id="userAllsearch"
						type="text"
						v-model="searchAllUsersText"
						:placeholder="$t('Search User')"
					/>

					<div
						v-for="u in filteredAllUsers"
						:key="u.username"
						@click="showProfileinfo(u.clientId)"
						class="user"
					>
						<div class="image">
							<img :src="getProfileImagePath(u)" height="50" :alt="u.username" />
						</div>
						<div class="info">
							<div class="name">{{ u.username }}</div>
							<div class="status">
								{{ u.rank.name }}
								<i v-if="u.rank.value == 0" class="fa fa-question-circle-o"></i>
								<i v-else-if="u.rank.value == 1" class="fa fa-user"></i>
								<i v-else v-for="i in u.rank.value - 1" :key="i" class="fa fa-star"></i>
							</div>
							<div class="text">{{ u.status.name }}</div>
						</div>
						<div class="icons">
							<div style="visibility: hidden" class="icon">
								<i class="fa fa-hand-paper-o"></i>
							</div>
							<div style="visibility: hidden" class="icon">
								<i style="font-size: 15pt" class="fa fa-mobile"></i>
							</div>
							<div class="icon">
								<i class="fa fa-microphone"></i>
							</div>
							<div class="icon">
								<i class="fa fa-video-camera"></i>
							</div>
						</div>
					</div>
				</div>
			</transition-group>
		</div>
		<div id="profileinfo" v-show="isProfileInfoVisible" v-if="viewingUser">
			<div class="goback">
				<span @click="showRoomInfo"
					><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> {{ $t('User Profile') }}</span
				>
			</div>
			<div class="uprofile">
				<h3><i class="fa fa-user"></i>{{ $t('Viewing Profile') }}</h3>
				<div class="image"><img :src="getProfileImagePath(viewingUser)" /></div>
				<div class="name">
					{{ `${viewingUser.username}${viewingUser.rank.value === 0 ? ' (' + $t('Guest') + ')' : ''}` }}
				</div>
				<div class="status">
					<span class="sinfo">{{ viewingUser.status.name }}</span
					><br /><span v-if="viewingUser.rank.value !== 0" class="createdDate">{{
						viewingUser.created
					}}</span>
				</div>
				<div class="uactions">
					<ul>
						<li class="privateMessage" @click="privateMessage(viewingUser)">
							<i class="fa fa-comment"></i> {{ $t('Private Message') }}
						</li>
						<li class="micCall" @click="startVoiceCall">
							<i class="fa fa-microphone"></i> {{ $t('Voice Call') }}
						</li>
						<li class="webcamCall" @click="startVideoCall">
							<i class="fa fa-video-camera"></i> {{ $t('Video Call') }}
						</li>
						<li @click="banUser"><i class="fa fa-ban"></i> {{ $t('Ban') }}</li>
						<li @click="reportUser"><i class="fa fa-flag"></i> {{ $t('Report') }}</li>
					</ul>
				</div>
				<div class="about">
					<h4><i class="fa fa-question-circle"></i> {{ $t('About Me') }}:</h4>
					<div class="uinfo">{{ viewingUser.about }}</div>
				</div>
			</div>
		</div>
		<div id="privatemessages" v-show="isPrivateMessagesVisible">
			<div class="goback">
				<span @click="showRoomInfo"
					><i class="fa fa-chevron-circle-left" aria-hidden="true"></i>&nbsp;{{ $t('Message Box') }}</span
				>
			</div>
			<div id="messagesContainer">
				<div v-if="Object.keys(privateMessages).length === 0" id="nomessage" class="message">
					<i class="fa fa-exclamation-triangle"></i> {{ $t('Message box is empty') }}
				</div>
				<div
					v-else
					v-for="(message, i) of privateMessages"
					:key="i"
					@click="privateMessage(message[0]?.user)"
					class="pmbox"
				>
					<div class="image"><img src="images/man-profile.png" height="50" alt="Mehmet46" /></div>
					<div class="info">
						<div class="name">{{ message[0]?.user.username }}</div>
						<div class="text">{{ truncateString(message[message.length - 1].text, 25) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getProfileImagePath, swalServerError } from '@/utils';
import axios from 'axios';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { defineComponent, Ref } from 'vue';
import { IRoom, ISendMessage, IUser, IUserForClient } from '@/interfaces/server.interfaces';
import SettingsVue from './Settings.vue';
import { SocketEventType } from '@/socket/socket.enum';

export default defineComponent({
	name: 'Left',
	data(): {
		isRoomListVisible: boolean;
		isUserListVisible: boolean;
		isAllUserListVisible: boolean;
		activeTab: 'ROOMS' | 'USERS' | 'ALLUSERS' | 'CHAT';
		windowWidth: number;
		isProfileInfoVisible: boolean;
		isPrivateMessagesVisible: boolean;
		viewingUser: IUserForClient | undefined;
		leftLastShowedType: 'ALL_USERS' | 'ROOM_USERS' | 'ROOMS';
		searchUsersText: string;
		searchAllUsersText: string;
		searchRoomText: string;
		roomUserCounts: Record<string, number>;
	} {
		return {
			isRoomListVisible: false,
			isUserListVisible: true,
			isAllUserListVisible: false,
			activeTab: 'USERS',
			windowWidth: window.innerWidth,
			isProfileInfoVisible: false,
			isPrivateMessagesVisible: false,
			viewingUser: undefined,
			leftLastShowedType: 'ROOM_USERS',
			searchUsersText: '',
			searchAllUsersText: '',
			searchRoomText: '',
			roomUserCounts: {},
		};
	},
	props: {
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
		allUsers: {
			type: Object as () => IUserForClient[],
			required: true,
		},
		isRightVisible: {
			type: Boolean,
			required: true,
		},
		rooms: {
			type: Object as () => IRoom[],
			required: true,
		},
		isPrivateChatVisible: {
			type: Boolean,
			required: true,
		},
		privateMessages: {
			type: Object as () => Record<string, ISendMessage[]>,
			required: true,
		},
	},
	emits: [
		'update:user',
		'update:allUsers',
		'update:isRightVisible',
		'update:isPrivateChatVisible',
		'privateChatStarted',
		'clearRoomMessages',
	],
	methods: {
		getProfileImagePath,
		startVoiceCall() {},
		startVideoCall() {},
		banUser() {},
		reportUser() {},
		async joinRoom(room: IRoom) {
			let password;
			if (room.hasPassword) {
				password = (
					await Swal.fire({
						title: 'Enter room password',
						input: 'password',
						inputLabel: 'Password',
						inputPlaceholder: 'Enter room password',
						inputAttributes: {
							autocapitalize: 'off',
							autocorrect: 'off',
						},
					})
				).value;
			}
			this.$socket.emit(SocketEventType.JOIN_ROOM, { room, password });
		},
		privateMessage(user: IUserForClient) {
			this.$emit('update:isPrivateChatVisible', true);
			this.$emit('privateChatStarted', { ...user });
		},
		setAllUnvisibleLeft() {
			if (this.isAllUserListVisible) {
				this.leftLastShowedType = 'ALL_USERS';
				this.isAllUserListVisible = false;
			} else if (this.isUserListVisible) {
				this.leftLastShowedType = 'ROOM_USERS';
				this.isUserListVisible = false;
			} else if (this.isRoomListVisible) {
				this.leftLastShowedType = 'ROOM_USERS';
				this.isRoomListVisible = false;
			}
			this.isPrivateMessagesVisible = false;
			this.isProfileInfoVisible = false;
		},
		setVisibleLastLeft() {
			if (this.leftLastShowedType == 'ALL_USERS') {
				this.isAllUserListVisible = true;
			} else if (this.leftLastShowedType == 'ROOM_USERS') {
				this.isAllUserListVisible = true;
			} else if (this.leftLastShowedType == 'ROOMS') {
				this.isRoomListVisible = true;
			}
		},
		showPrivateMessages() {
			this.setAllUnvisibleLeft();
			this.isPrivateMessagesVisible = true;
		},
		showRoomInfo() {
			this.setAllUnvisibleLeft();
			this.setVisibleLastLeft();
		},
		showProfileinfo(clientId: string) {
			if (this.user?.clientId == clientId) {
				if (this.user.rank.value == 0) {
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
										this.$emit('update:user', response.data);
									})
									.catch((error: any) => {
										swalServerError(error);
									});
							}
						})
						.catch();
				}
			} else {
				this.setAllUnvisibleLeft();
				this.viewingUser = this.allUsers.find((user) => user.clientId === clientId);
				this.isProfileInfoVisible = true;
			}
		},
		showRooms() {
			this.setAllUnvisibleLeft();
			this.activeTab = 'ROOMS';
			this.isRoomListVisible = true;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		showChat() {
			this.setAllUnvisibleLeft();
			this.activeTab = 'CHAT';
			if (this.isMobile) {
				this.$emit('update:isRightVisible', true);
			}
		},
		showAllUsers() {
			this.setAllUnvisibleLeft();
			this.activeTab = 'ALLUSERS';
			this.isAllUserListVisible = true;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		showUsers() {
			this.setAllUnvisibleLeft();
			this.activeTab = 'USERS';
			this.isUserListVisible = true;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		updateWidth() {
			this.windowWidth = window.innerWidth;
		},
		truncateString(str: string, num: number) {
			if (str.length <= num) {
				return str;
			}
			return str.slice(0, num) + '...';
		},
	},
	mounted() {
		window.addEventListener('resize', this.updateWidth);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.updateWidth);
	},
	created() {
		this.$socket.on(SocketEventType.JOIN_ROOM, (room: IRoom) => {
			this.$emit('clearRoomMessages');
			this.user.room = room;
		});
		this.$socket.on(SocketEventType.ROOM_USER_COUNTS, (data: Record<string, number>) => {
			this.roomUserCounts = data;
		});

		this.$socket.emit(SocketEventType.ROOM_USER_COUNTS);
	},
	computed: {
		isMobile(): boolean {
			return this.windowWidth < 1001;
		},
		profileImagePath(): string {
			if (this.user) {
				return getProfileImagePath(this.user);
			}
			return '';
		},
		allUsersLength(): number {
			return this.allUsers.length;
		},
		roomUsersLength(): number {
			return this.allUsers.filter((u) => u.room.id == this.user.room.id).length;
		},
		filteredUsers() {
			if (!this.searchUsersText) return this.roomUsers;

			return this.roomUsers.filter((user) =>
				user.username.toLowerCase().includes(this.searchUsersText.toLowerCase()),
			);
		},
		filteredAllUsers() {
			if (!this.searchAllUsersText) return this.allUsers;

			return this.allUsers.filter((user) =>
				user.username.toLowerCase().includes(this.searchAllUsersText.toLowerCase()),
			);
		},
		filteredRooms() {
			if (!this.searchRoomText) return this.rooms;

			return this.rooms.filter((room) => room.name.toLowerCase().includes(this.searchRoomText.toLowerCase()));
		},
		roomUsers() {
			return this.allUsers.filter((user) => user.room.id == this.user.room.id);
		},
	},
	watch: {
		isMobile(newVal: boolean) {
			if (!newVal) {
				this.$emit('update:isRightVisible', true);
				this.showUsers();
			}
		},
	},
});
</script>

<style>
.slide-enter-active {
	animation: slideInRight 0.3s;
}
.slide-leave-active {
	animation: slideOutRight 0s;
}
</style>
