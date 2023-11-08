<template>
	<div class="adminpages">
		<h3>
			<span><i class="fa fa-cog"></i> {{ $t('General Settings') }}</span>
		</h3>

		<div class="admincontent2">
			<TextInput
				iconClass="fa fa-tag"
				:placeholder="$t('Website Title')"
				:label="$t('Website Title')"
				v-model="settings.title"
			/>
			<!-- TODO upload logo -->
			<TextInput
				iconClass="fa fa-picture-o"
				:placeholder="$t('Logo URL')"
				:label="$t('Logo URL')"
				v-model="settings.logo"
			/>
			<SwitchInput iconClass="fa fa-user-plus" :label="$t('New Members')" v-model="settings.newMemberActive" />
			<SwitchInput
				iconClass="fa fa-users"
				:label="$t('Member Private Message')"
				v-model="settings.membersCanPM"
			/>
			<SwitchInput
				iconClass="fa fa-users"
				:label="$t('Member Voice Call')"
				v-model="settings.membersCanVoiceCall"
			/>
			<SwitchInput
				iconClass="fa fa-users"
				:label="$t('Member Video Call')"
				v-model="settings.membersCanVideoCall"
			/>
			<SwitchInput iconClass="fa fa-user-plus" :label="$t('Guest Login')" v-model="settings.guestLoginActive" />
			<SwitchInput iconClass="fa fa-users" :label="$t('Guest Private Message')" v-model="settings.guestsCanPM" />
			<SwitchInput
				iconClass="fa fa-users"
				:label="$t('Guest Voice Call')"
				v-model="settings.guestsCanVoiceCall"
			/>
			<SwitchInput
				iconClass="fa fa-users"
				:label="$t('Guest Video Call')"
				v-model="settings.guestsCanVideoCall"
			/>
			<SaveButton @save="update" />
		</div>
	</div>
</template>

<script lang="ts">
import { SocketEventType } from '@/socket/socket.enum';
import { ISettings } from '@/types';
import { swalServerError } from '@/utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';
import SaveButtonVue from '../inputs/SaveButton.vue';
import SwitchInputVue from '../inputs/SwitchInput.vue';
import TextInputVue from '../inputs/TextInput.vue';

export default defineComponent({
	name: 'GeneralSettings',
	components: {
		TextInput: TextInputVue,
		SwitchInput: SwitchInputVue,
		SaveButton: SaveButtonVue,
	},
	data(): {
		settings: ISettings;
	} {
		return {
			settings: {} as ISettings,
		};
	},
	mounted() {
		axios
			.get('/settings')
			.then((response) => {
				this.settings = response.data;
			})
			.catch((error) => swalServerError(error));
	},
	methods: {
		update() {
			axios
				.patch('/admin/updateSettings', this.settings)
				.then(() => {
					Swal.fire(this.$t('Successful'), undefined, 'success');
					this.$socket.emit(SocketEventType.SETTINGS_UPDATED);
				})
				.catch((error) => swalServerError(error));
		},
	},
});
</script>
