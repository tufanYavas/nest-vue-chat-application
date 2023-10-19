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
		let script = document.createElement('script');
		script.setAttribute('src', './plugins.js');
		document.head.appendChild(script);
	},
});
</script>

<style></style>
