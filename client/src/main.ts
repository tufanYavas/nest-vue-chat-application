import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/lang/i18n';
import BootstrapVue3 from 'bootstrap-vue-3';
import jQuery from 'jquery';
import Swal from 'sweetalert2';
import axios from 'axios';
import router from './router';
import { io } from 'socket.io-client';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const socket = io('http://localhost:3131', {
	withCredentials: true,
});

window.socket = socket;
window.$ = window.jQuery = jQuery;
window.Swal = Swal;

createApp(App).use(router).use(BootstrapVue3).use(i18n).mount('#app');
