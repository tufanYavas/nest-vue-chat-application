<template>
	<div class="center-flex">
		<section id="content">
			<form>
				<h1>
					<img src="../assets/logo.png" height="60" alt="Logo" />
				</h1>
				<div>
					<input type="text" name="username" :placeholder="$t('Username')" required v-model="username" />
					<input
						type="password"
						:placeholder="$t('Password')"
						name="password"
						v-if="showPassword"
						v-model="password"
					/>
				</div>

				<div class="gender-area" v-if="showGender">
					<input id="man" type="radio" name="gender" value="1" checked v-model="gender" />
					<label id="manLabel" for="man">{{ $t('Man') }}</label>
					<input id="woman" type="radio" name="gender" value="0" v-model="gender" />
					<label id="womanLabel" for="woman">{{ $t('Woman') }}</label>
				</div>

				<div class="loginBtnWrapper">
					<button type="button" @click="validateUser()" id="loginBtn">{{ $t('Connect') }}</button>
				</div>
			</form>
		</section>
	</div>
</template>

<script lang="ts">
import { swalServerError } from '@/utils';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Login',
	data() {
		return {
			username: '',
			password: '',
			nickname: '',
			gender: 1,
			showPassword: false,
			showGender: true,
			showNickname: false,
		};
	},
	props: {},
	methods: {
		guestLogin() {
			axios
				.post('/auth/guestLogin', {
					username: this.username,
					gender: this.gender.toString() === '1' ? true : false,
				})
				.then(() => {
					setTimeout(() => {
						this.$router.push('/chat');
					}, 1200);
				})
				.catch((error: any) => {
					swalServerError(error);
				});
		},
		validateUser() {
			if (this.username.length == 0) {
				return Swal.fire(this.$t('Warning'), this.$t('You did not enter your username.'), 'warning');
			}
			if (this.username.length < 3) {
				return Swal.fire(
					this.$t('Warning'),
					this.$t('Username must be at least 3 characters long.'),
					'warning',
				);
			}
			if (this.username.length > 18) {
				return Swal.fire(this.$t('Warning'), this.$t('Username can be at most 18 characters long.'), 'warning');
			}

			if (this.showPassword) {
				if (this.password.length < 6) {
					return Swal.fire(
						this.$t('Warning'),
						this.$t('Password must be at least 6 characters long.'),
						'warning',
					);
				}
				if (this.password.length > 18) {
					return Swal.fire(
						this.$t('Warning'),
						this.$t('Password can be at most 18 characters long.'),
						'warning',
					);
				}

				axios
					.post('/auth/signin', {
						username: this.username,
						password: this.password,
					})
					.then((response: any) => {
						this.$router.push('/chat');
					})
					.catch((error: any) => {
						swalServerError(error);
					});
			} else {
				axios
					.post('/user/validateUser', {
						username: this.username,
						gender: this.gender.toString() === '1' ? true : false,
					})
					.then((response: any) => {
						const result: number = response.data;
						if (result == 1) {
							this.showPassword = true;
							this.showGender = false;
							this.showNickname = true;
						} else if (result == 2) {
							this.showPassword = true;
							this.showGender = false;
						} else {
							this.guestLogin();
						}
					})
					.catch((error: any) => {
						swalServerError(error);
					});
			}
		},
	},
});
</script>

<style scoped>
@import '@/assets/css/animate.css';
@import '@/assets/css/login.css';
</style>
