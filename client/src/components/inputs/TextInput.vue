<template>
	<div class="form-group">
		<label class="text-input-label"><i :class="iconClass" aria-hidden="true"></i> {{ label }}</label>
		<input class="text-input" :placeholder="placeholder" :value="modelValue" :type="type" @input="updateValue" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'TextInput',
	data(): {} {
		return {};
	},
	props: {
		label: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'text',
		},
		iconClass: {
			type: String,
			required: true,
		},
		modelValue: {
			type: String,
			default: '',
		},
	},
	methods: {
		updateValue(event: Event) {
			this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
		},
	},
});
</script>

<style scoped>
.text-input-label {
	margin-left: 20px;
}
.text-input {
	width: calc(100% - 40px);
	height: 40px;
	box-sizing: border-box;
	padding: 5px;
	border: 1px solid #d7d7d7;
	display: block;
	margin: 10px 0 10px 20px;
}
</style>
