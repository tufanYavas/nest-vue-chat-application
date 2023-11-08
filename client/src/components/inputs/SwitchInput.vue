<template>
	<div class="form-group switch-input">
		<div class="oo-switch">
			<span><i :class="iconClass"></i> {{ label }}</span>
		</div>
		<div class="oo-switch2">
			<div class="onoffswitch">
				<input
					type="checkbox"
					:id="id"
					class="onoffswitch-checkbox"
					:checked="modelValue"
					@click="updateValue"
				/>
				<label class="onoffswitch-label" :for="id"></label>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SwitchInput',
	data(): {
		id: string;
	} {
		return {
			id: String(Math.random()),
		};
	},
	props: {
		label: {
			type: String,
			required: true,
		},
		iconClass: {
			type: String,
			required: true,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		updateValue(event: Event) {
			this.$emit('update:modelValue', (event.target as HTMLInputElement).checked);
		},
	},
});
</script>

<style scoped>
.switch-input {
	margin: 0 0 20px 20px;
}
.oo-switch {
	padding: 5px 0;
}
</style>
