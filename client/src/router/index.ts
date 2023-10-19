import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Chat from '../views/chat/Chat.vue';
import axios from 'axios';

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/chat',
		name: 'Chat',
		component: Chat,
		meta: {
			requiresAuth: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	axios
		.post('/auth/route')
		.then(() => {
			if (to.path !== '/chat') {
				next('/chat');
			} else {
				next();
			}
		})
		.catch(() => {
			if (to.path !== '/login') {
				next('/login');
			} else {
				next();
			}
		});
});

export default router;
