<template>
	<div class="message">
		<div class="image">
			<img :src="`uploads/images/${message.user.profileImage}`" height="32" :alt="message.user.username" />
		</div>
		<div class="content">
			<div :style="{ 'font-size': `${message.user.preference.fontSize ?? 14}pt` }" class="inner">
				<span class="mmessage" style="word-break: break-all"
					><span style="font-weight: 600">{{ message.user.username }}:</span
					><span :style="{ color: message.user.preference.fontColor ?? 'black' }">{{
						message.text
					}}</span></span
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ISendMessage } from '@/interfaces/server.interfaces';
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
	methods: {},
});
</script>
