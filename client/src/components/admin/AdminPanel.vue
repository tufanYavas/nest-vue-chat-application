<template>
	<div class="adminpanel">
		<button class="close-button" @click="$emit('closeAdminPanel')">X</button>

		<h2>
			<span class="currentHeading">{{ $t('Admin Panel') }}</span>
		</h2>

		<div class="adminmenu">
			<ul>
				<li
					v-if="user.permission.canEditGeneralSettings"
					@click="activePage = 'GeneralSettings'"
					:class="{ active: activePage === 'GeneralSettings' }"
				>
					<i class="fa fa-cog fa-3x"></i><br />{{ $t('General Settings') }}
				</li>
				<li
					v-if="user.permission.canEditUsers"
					@click="activePage = 'Users'"
					:class="{ active: activePage === 'Users' }"
				>
					<i class="fa fa-users fa-3x"></i><br />{{ $t('Users') }}
				</li>
				<li
					v-if="user.permission.canEditRooms"
					@click="activePage = 'Rooms'"
					:class="{ active: activePage === 'Rooms' }"
				>
					<i class="fa fa-comment fa-3x"></i><br />{{ $t('Rooms') }}
				</li>
				<li
					v-if="user.permission.canEditStatusList"
					@click="activePage = 'Status'"
					:class="{ active: activePage === 'Status' }"
				>
					<i class="fa fa-list-ul fa-3x"></i><br />{{ $t('Status') }}
				</li>
				<li
					v-if="user.permission.canEditRanks"
					@click="activePage = 'Rank'"
					:class="{ active: activePage === 'Rank' }"
				>
					<i class="fas fa-trophy fa-3x"></i><br />{{ $t('Rank') }}
				</li>
			</ul>
		</div>

		<div class="admincontent">
			<GeneralSettings v-if="activePage === 'GeneralSettings'" />
			<Users v-if="activePage === 'Users'" :user="user" />
			<Rooms v-if="activePage === 'Rooms'" />
			<Status v-if="activePage === 'Status'" />
			<Rank v-if="activePage === 'Rank'" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusVue from './Status.vue';
import GeneralSettingsVue from './GeneralSettings.vue';

import RankVue from './Rank.vue';
import RoomsVue from './Rooms.vue';
import UsersVue from './Users.vue';
import { IUserForClient } from '@/types';

export default defineComponent({
	name: 'AdminPanel',
	components: {
		GeneralSettings: GeneralSettingsVue,
		Users: UsersVue,
		Rooms: RoomsVue,
		Status: StatusVue,
		Rank: RankVue,
	},
	data(): {
		activePage: 'GeneralSettings' | 'Users' | 'Rooms' | 'Status' | 'Rank';
	} {
		return {
			activePage: 'GeneralSettings',
		};
	},
	props: {
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
	},
	emits: ['closeAdminPanel'],
	mounted() {},
});
</script>
