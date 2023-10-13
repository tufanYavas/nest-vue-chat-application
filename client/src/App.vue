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
		let script = document.createElement('script');
		script.setAttribute('src', './plugins.js');
		document.head.appendChild(script);
	},
});
</script>

<style>
@import 'assets/css/animate.css';
@import 'assets/css/ionicons.min';
@import 'assets/css/login.css';
@import 'assets/css/magnific-popup.css';
@import 'assets/css/style.css';
</style>
