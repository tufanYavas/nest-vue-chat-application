import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/lang/i18n';
import jQuery from 'jquery';
import Swal from 'sweetalert2';
import axios from 'axios';
import router from './router';
import socketPlugin from './plugins/socketPlugin';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.withCredentials = true;

import 'sweetalert2/dist/sweetalert2.min.css';

window.$ = window.jQuery = jQuery;
window.Swal = Swal;

createApp(App).use(router).use(socketPlugin).use(i18n).mount('#app');
