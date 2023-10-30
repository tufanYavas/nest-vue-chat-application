<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Login from './views/Login.vue';

export default defineComponent({
	name: 'App',
	components: {
		Login,
	},
	created() {
		window.$t = this.$t;
	},
});
</script>

<style></style>
