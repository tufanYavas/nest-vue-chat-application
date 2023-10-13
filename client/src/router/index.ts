import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Chat from '../views/chat/Chat.vue';

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
	if (to.path !== '/login' && to.path !== '/chat') {
		return next('/login');
	}

	next();
});

export default router;
