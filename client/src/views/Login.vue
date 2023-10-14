<template>
	<div class="hello">
		<div class="container">
			<section id="content">
				<form
					onsubmit="return false;"
					id="loginForm"
					method="post"
					class="registration-form"
				>
					<h1>
						<img src="../assets/logo.png" height="60" alt="Logo" />
					</h1>
					<div>
						<input
							type="text"
							name="username"
							placeholder="Kullanıcı Adınız"
							required
							v-model="username"
						/>
						<input
							type="password"
							placeholder="Parolanız"
							name="password"
							v-if="showPassword"
							v-model="password"
						/>
						<input
							type="text"
							placeholder="Ajan Girişi"
							name="rumuz"
							v-if="showNickname"
							v-model="nickname"
						/>
					</div>

					<div class="cinsiyet-alani" v-if="showGender">
						<input
							id="erkek"
							type="radio"
							name="gender"
							value="1"
							checked
							v-model="gender"
						/>
						<label id="erkekLabel" for="erkek">Bay</label>
						<input
							id="kadin"
							type="radio"
							name="gender"
							value="0"
							v-model="gender"
						/>
						<label id="kadinLabel" for="kadin">Bayan</label>
					</div>

					<div class="loginBtnWrapper">
						<button
							type="button"
							@click="validateUser()"
							id="loginBtn"
						>
							Bağlan!
						</button>
					</div>
				</form>
				<!-- form -->
				<div class="button">
					<a href="#">Gizlilik</a>
					<a target="_blank" href="#">Kurallar</a>
					<a target="_blank" href="#">Sohbet</a>
				</div>
				<!-- button -->
			</section>
			<!-- content -->
		</div>
	</div>
</template>

<script lang="ts">
import axios from 'axios';
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
				.post(
					'/auth/guestLogin',
					{
						username: this.username,
						gender: this.gender.toString() === '1' ? true : false,
					},
					{ withCredentials: true },
				)
				.then(() => {
					console.log('chatttttttttt');
					this.$router.push('/chat');
					// setTimeout(() => {
					// 	this.$router.push('/chat');
					// }, 1500);
				})
				.catch((response: any) => {
					return Swal.fire('Hata', response.data.message, 'error');
				});
		},
		validateUser() {
			if (this.username.length == 0) {
				return Swal.fire(
					'Uyarı',
					'Kullanıcı adınızı girmediniz.',
					'warning',
				);
			}
			if (this.username.length < 3) {
				return Swal.fire(
					'Uyarı',
					'Kullanıcı adı en az 3 karakter olmak zorundadır.',
					'warning',
				);
			}
			if (this.username.length > 18) {
				return Swal.fire(
					'Uyarı',
					'Kullanıcı adı en fazla 18 karakterdir.',
					'warning',
				);
			}
			if (this.showPassword) {
				axios
					.post(
						'/auth/signin',
						{
							username: this.username,
							password: this.password,
						},
						{ withCredentials: true },
					)
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
					});
			} else {
				axios
					.post(
						'/users/validateUser',
						{
							username: this.username,
							gender:
								this.gender.toString() === '1' ? true : false,
						},
						{ withCredentials: true },
					)
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
					});
			}
		},
	},
});
</script>
