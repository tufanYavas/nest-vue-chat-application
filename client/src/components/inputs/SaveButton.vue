<template>
	<button class="save-button" @click="$emit('save')"><i class="fa fa-floppy-o"></i> {{ $t(text) }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SaveButton',
	emits: ['save'],
	props: {
		text: {
			type: String,
			default: 'Save',
		},
	},
});
</script>

<style scoped>
.save-button {
	width: 30%;
	margin-bottom: 20px;
	cursor: pointer;
	height: 40px;
	box-sizing: border-box;
	padding: 5px;
	border: 0;
	background: #0f1012;
	color: #fff;
	font-weight: bold;
	display: block;
	margin-left: calc(50% - 15%);
	border-radius: 10px;
}

@media only screen and (max-width: 1151px) {
	.save-button {
		width: 80%;
		margin-left: calc(50% - 40%);
	}
}
</style>
