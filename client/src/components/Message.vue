<template>
	<div class="message">
		<div class="image">
			<img :src="getProfileImagePath(message.user)" height="32" :alt="message.user.username" />
		</div>
		<div class="content">
			<div :style="{ 'font-size': `${message.user.preference.fontSize ?? 14}pt` }" class="inner">
				<span class="mmessage" style="word-break: break-all">
					<a
						v-if="message.contentType === 'IMAGE' && message.contentPath"
						:href="`uploads/chat-images/${message.contentPath}`"
						target="_blank"
					>
						<img style="width: 150px; height: auto" :src="`uploads/chat-images/${message.contentPath}`" />
					</a>
					<span v-else>
						<span style="font-weight: 600">{{ message.user.username }}:</span>
						<span :style="{ color: message.user.preference.fontColor ?? 'black' }">{{ message.text }}</span>
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ISendMessage } from '@/types';
import { getProfileImagePath } from '@/utils';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Message',
	data(): {} {
		return {};
	},
	props: {
		message: {
			type: Object as () => ISendMessage,
			required: true,
		},
	},
	methods: { getProfileImagePath },
});
</script>
