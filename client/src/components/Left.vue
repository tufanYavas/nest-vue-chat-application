<template>
	<div id="left">
		<div id="roominfo">
			<div id="selection">
				<ul>
					<li
						id="showChat"
						@click="showChat"
						class="md-hidden m-active"
						:class="{
							'm-active': activeTab === 'CHAT' && isMobile,
						}"
					>
						<i class="fa fa-commenting" aria-hidden="true"></i>
						Sohbet
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
						Odalar
					</li>
					<li
						id="showAllUsers"
						@click="showAllUsers"
						:class="{
							active: activeTab === 'ALLUSERS' && !isMobile,
							'm-active': activeTab === 'ALLUSERS' && isMobile,
						}"
					>
						<i class="fa fa-users"></i> Tüm Kişiler (<span style="cursor: pointer" id="whole">0</span>)
					</li>
					<li
						id="showUsers"
						@click="showUsers"
						:class="{
							active: activeTab === 'USERS' && !isMobile,
							'm-active': activeTab === 'USERS' && isMobile,
						}"
					>
						<i class="fa fa-users"></i> Oda (<span style="cursor: pointer" id="wholeroom">0</span>)
					</li>
				</ul>
			</div>

			<transition-group name="slide-fade">
				<div id="roomlist" key="0" v-show="isRoomListVisible">
					<i style="margin: 0 0 0 10px" class="fa fa-search"></i
					><input class="search" id="roomsearch" type="text" placeholder="Oda ara..." />

					<div
						v-for="room in rooms"
						:key="room.id"
						class="room"
						:class="{ active: room.id == currentRoom.id }"
					>
						<div class="name"><i class="fa fa-comment-o" aria-hidden="true"></i> {{ room.name }}</div>
						<div class="online">
							<i class="fa fa-lock"></i>
							<i class="fa fa-group"></i> <span class="roomCount" :data-name="room.name">0</span>
						</div>
					</div>
				</div>

				<div id="userlist" key="1" v-show="isUserListVisible">
					<i style="margin: 0 0 0 10px" class="fa fa-search"></i
					><input
						class="search"
						id="usersearch"
						autocomplete="off"
						type="text"
						placeholder="Oda kişilerinde ara"
					/>

					<div
						v-for="u in usersInRoom"
						:key="u.username"
						@click="$emit('showProfileinfo', u.participantId)"
						class="user"
					>
						<div class="image">
							<img style="cursor: pointer" :src="u.profileImage" height="50" :alt="u.username" />
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
					><input class="search" id="userAllsearch" type="text" placeholder="Tüm kişilerde ara" />

					<div
						v-for="u in usersInAllRooms"
						:key="u.username"
						@click="$emit('showProfileinfo', u.participantId)"
						class="user"
					>
						<div class="image">
							<img src="images/man-profile.png" height="50" :alt="u.username" />
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
		<div id="profileinfo">
			<div class="goback">
				<span onclick="showRoomInfo();"
					><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Kullanıcı Profili</span
				>
			</div>
			<div class="uprofile">
				<h3><i class="fa fa-user"></i> Profil görüntüleniyor</h3>
				<div class="image"></div>
				<div class="name"></div>
				<div class="status"><span class="sinfo"></span><br /><span class="createdDate"></span></div>
				<div class="uactions">
					<ul>
						<li id="privateMessage" class="privateMessage" onclick="privateMessage();">
							<i class="fa fa-comment"></i> Özel Mesaj
						</li>
						<li id="micCall" class="micCall" onclick="micCall();">
							<i class="fa fa-microphone"></i> Sesli Arama
						</li>
						<li id="webcamCall" class="webcamCall" onclick="webcamCall();">
							<i class="fa fa-video-camera"></i> Görüntülü Arama
						</li>
						<li id="banUser" onclick="banUser();"><i class="fa fa-ban"></i> Engelle</li>
						<li id="reportUser" onclick="report();"><i class="fa fa-flag"></i> Şikayet Et</li>
					</ul>
				</div>
				<div class="about">
					<h4><i class="fa fa-question-circle"></i> Hakkında:</h4>
					<div class="uinfo"></div>
				</div>
			</div>
		</div>
		<div id="privatemessages">
			<div class="goback">
				<span onclick="showRoomInfo();"
					><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Mesaj Kutusu</span
				>
			</div>
			<div id="messagesContainer">
				<div id="nomessage" class="message"><i class="fa fa-exclamation-triangle"></i> Mesaj kutusunuz boş</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { defineComponent } from 'vue';
import { IRoom, IUser } from '@/interfaces/server.interfaces';
import { IUserForList } from '@/views/chat/Chat.vue';
import { Connection } from '@/rtc/connection';

export default defineComponent({
	name: 'Left',
	data(): {
		rooms: IRoom[];
		isRoomListVisible: boolean;
		isUserListVisible: boolean;
		isAllUserListVisible: boolean;
		activeTab: 'ROOMS' | 'USERS' | 'ALLUSERS' | 'CHAT';
		windowWidth: number;
	} {
		return {
			rooms: [],
			isRoomListVisible: false,
			isUserListVisible: true,
			isAllUserListVisible: false,
			activeTab: 'USERS',
			windowWidth: window.innerWidth,
		};
	},
	props: {
		user: {
			type: Object as () => IUser,
			required: true,
		},
		usersInRoom: {
			type: Object as () => IUserForList[],
			required: true,
		},
		usersInAllRooms: {
			type: Object as () => IUserForList[],
			required: true,
		},
		currentRoom: {
			type: Object as () => IRoom,
			required: true,
		},
		isRightVisible: {
			type: Boolean,
			required: true,
		},
	},
	emits: [
		'update:user',
		'update:usersInRoom',
		'update:usersInAllRooms',
		'update:currentRoom',
		'update:isRightVisible',
		'showProfileinfo',
	],
	methods: {
		showRooms() {
			console.log(JSON.stringify(this.rooms, null, 4));
			this.activeTab = 'ROOMS';
			this.isUserListVisible = false;
			this.isAllUserListVisible = false;
			this.isRoomListVisible = true;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		showChat() {
			this.activeTab = 'CHAT';
			this.isUserListVisible = false;
			this.isAllUserListVisible = false;
			this.isRoomListVisible = false;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', true);
			}
		},
		showAllUsers() {
			this.activeTab = 'ALLUSERS';
			this.isUserListVisible = false;
			this.isAllUserListVisible = true;
			this.isRoomListVisible = false;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		showUsers() {
			this.activeTab = 'USERS';
			this.isUserListVisible = true;
			this.isAllUserListVisible = false;
			this.isRoomListVisible = false;
			if (this.isMobile) {
				this.$emit('update:isRightVisible', false);
			}
		},
		updateWidth() {
			this.windowWidth = window.innerWidth;
		},
	},
	mounted() {
		window.addEventListener('resize', this.updateWidth);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.updateWidth);
	},
	created() {
		this.rooms = Connection.rooms;
		console.log(this.currentRoom);
	},
	computed: {
		isMobile(): boolean {
			return this.windowWidth < 1001;
		},
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
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
	transform: translateY(10px);
	opacity: 0;
}
</style>
