<template>
	<div id="chat">
		<div v-for="(message, id) in messages" :key="id">
			<div
				v-if="
					message.type == 'SYSTEM_MESSAGE' ||
					(message.type === 'ROOM_EVENT' && message.user.room.id === user?.room.id) ||
					message.type === 'ALL_EVENT'
				"
				class="message"
			>
				<div class="centered-content">
					<div class="content">
						<div class="inner">
							<span class="bold">
								{{ message.text }}
								<a
									v-if="
										user &&
										message.user.rank.value < user.rank.value &&
										user.permission.canSeeIpOfUsers
									"
									style="color: blue"
									@click="whoIs(message.user.username)"
								>
									{{ $t('Who is?') }}
								</a>
							</span>
						</div>
					</div>
				</div>
			</div>
			<Message v-if="message.type === 'ALL_MESSAGE' || message.type === 'ROOM_MESSAGE'" :message="message" />
			<Message v-if="message.type === 'PRIVATE_MESSAGE'" :message="message" />
		</div>
	</div>
</template>

<script lang="ts">
import { ISendMessage, IUserForClient } from '@/interfaces/server.interfaces';
import { SocketEventType } from '@/socket/socket.enum';
import { defineComponent } from 'vue';
import MessageVue from '@/components/Message.vue';

export default defineComponent({
	name: 'ChatMessageArea',
	data(): {} {
		return {};
	},
	components: {
		Message: MessageVue,
	},
	props: {
		messages: {
			type: Object as () => ISendMessage[],
			required: true,
		},
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
	},
	methods: {
		whoIs(username: string) {
			this.$socket.emit(SocketEventType.GET_IP, username);
		},
	},
	watch: {
		messages: {
			handler(user) {
				console.log({ messages: this.messages });
			},
			deep: true,
		},
	},
});
</script>
