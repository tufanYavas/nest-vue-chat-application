<template>
	<div>
		<div class="broadcast-container">
			<Broadcast
				:initW="180"
				:initH="80"
				:minW="0"
				:minH="0"
				:isVideo="false"
				:lockAspectRatio="false"
				class="draggable-audio"
				v-for="streamWrapper in audioStreams"
				:key="streamWrapper.stream.id"
				autoplay
				:streamWrapper="streamWrapper"
				@removeStream="removeStream($event)"
			/>

			<Broadcast
				:initW="240"
				:initH="180"
				:minW="240"
				:minH="180"
				:isVideo="true"
				:lockAspectRatio="true"
				class="draggable-video"
				v-for="streamWrapper in videoStreams"
				:key="streamWrapper.stream.id"
				autoplay
				:streamWrapper="streamWrapper"
				@removeStream="removeStream($event)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Call, IUserForClient, MediaType, MediaStreamWrapper, MediaConnectionWithMetadata } from '@/types';
import { SocketEventType } from '@/socket/socket.enum';
import { getProfileImagePath } from '@/utils';
import Peer, { PeerError } from 'peerjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { defineComponent } from 'vue';
import Broadcast from './Broadcast.vue';

export default defineComponent({
	name: 'Message',
	components: {
		Broadcast,
	},
	data(): {
		peer: Peer;
		videoStreams: MediaStreamWrapper[];
		audioStreams: MediaStreamWrapper[];
		callSound: HTMLAudioElement;
	} {
		return {
			peer: new Peer(this.user.clientId, {
				host: process.env.VUE_APP_PEER_SERVER_HOST,
				port: parseInt(process.env.VUE_APP_PEER_SERVER_PORT),
				path: process.env.VUE_APP_PEER_SERVER_PATH,
			}),
			videoStreams: [],
			audioStreams: [],
			callSound: new Audio('/sounds/call.mp3'),
		};
	},
	props: {
		user: {
			type: Object as () => IUserForClient,
			required: true,
		},
	},
	emits: ['conversationOver'],
	mounted() {
		this.callSound.loop = true;
		this.$socket.on(SocketEventType.CALL_ENDED, () => {
			Swal.close();
		});

		this.peer.on('call', this.onCall);
	},
	methods: {
		playSound() {
			setTimeout(() => {
				try {
					this.callSound.play();
				} catch (error) {}
			}, 100);
		},
		removeStream(streamWrapper: MediaStreamWrapper) {
			if (streamWrapper.stream.getVideoTracks().length) {
				this.videoStreams = this.videoStreams.filter(
					(_streamWrapper) => _streamWrapper.stream.id !== streamWrapper.stream.id,
				);
			} else {
				this.audioStreams = this.audioStreams.filter(
					(_streamWrapper) => _streamWrapper.stream.id !== streamWrapper.stream.id,
				);
			}
			streamWrapper.stream.getTracks().forEach((track) => {
				track.stop();
			});
			if (streamWrapper.callObject) streamWrapper.callObject.close();
		},
		onCallErrorOrClose(
			localStream?: MediaStreamWrapper,
			remoteStream?: MediaStreamWrapper,
			error?: PeerError<'negotiation-failed' | 'connection-closed'>,
		) {
			this.callSound.pause();
			if (remoteStream) this.removeStream(remoteStream);
			if (localStream) this.removeStream(localStream);
			this.$emit('conversationOver');
			this.$socket.emit(SocketEventType.CALL_ENDED);
			if (error) Swal.fire(this.$t('Call Error'), error.message, 'error');
		},
		onCall(call: MediaConnectionWithMetadata) {
			if (!call) return;
			const metadata = call.metadata;
			Swal.fire({
				title: `<i class="fa fa-phone-square"></i> ${metadata.callerUser.username} ${this.$t('calling you')}`,
				html: `<img class="rounded" src="${getProfileImagePath(metadata.callerUser)}" height="80" alt="${
					metadata.callerUser.username
				}"><br><br><span class="waiting">${this.$t(
					'Incoming ' + metadata.mediaType.toLowerCase() + ' call',
				)}</span>`,
				showCancelButton: true,
				cancelButtonText: this.$t('Cancel'),
				confirmButtonText: this.$t('Answer the call'),
				timer: 30000,
				cancelButtonColor: '#c92f2f',
				confirmButtonColor: '#7dd54d',
			}).then((result: SweetAlertResult) => {
				this.callSound.pause();
				if (result.isConfirmed) {
					const mediaConstraints: MediaStreamConstraints = {
						video: metadata.mediaType === 'VOICE' ? false : true,
						audio: true,
					};
					const getUserMedia =
						navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
					getUserMedia(
						mediaConstraints,
						(stream) => {
							const myStream: MediaStreamWrapper = {
								stream,
								callObject: call,
								isCaller: false,
							};
							this.handleStream(myStream, metadata.mediaType);
							let rs: MediaStreamWrapper;
							call.answer(stream);
							call.on('stream', (remoteStream: MediaStream) => {
								rs = { stream: remoteStream, callObject: call, isCaller: true };
								this.handleStream(rs, metadata.mediaType);
							});

							call.on('error', (error: PeerError<'negotiation-failed' | 'connection-closed'>) => {
								this.onCallErrorOrClose(myStream, undefined, error);
							});

							call.on('close', () => {
								this.onCallErrorOrClose(myStream, rs);
							});
						},
						(error) => console.error(error),
					);
				} else {
					call.close();
					this.$socket.emit(SocketEventType.CALL_ENDED);
				}
			});
			if (this.user.preference.notificationEnabled) this.playSound();
		},
		handleStream(streamWrapper: MediaStreamWrapper, mediaType: MediaType) {
			if (mediaType === 'VOICE') {
				if (!this.audioStreams.find((audioStream) => audioStream.stream.id === streamWrapper.stream.id)) {
					this.audioStreams.push(streamWrapper);
				}
			} else if (mediaType === 'VIDEO') {
				if (!this.videoStreams.find((videoStream) => videoStream.stream.id === streamWrapper.stream.id)) {
					this.videoStreams.push(streamWrapper);
				}
			}
			console.log({ remoteStream: streamWrapper });
		},
		startCall(call: Call) {
			if (!call.calledUser.clientId) return;
			this.$socket.emit(SocketEventType.PRIVATE_CALL, { user: call.calledUser }, (error: string) => {
				if (error) {
					Swal.fire(this.$t('Error'), error, 'error');
				} else {
					let myStream: MediaStreamWrapper;
					Swal.fire({
						title: `<i class="fa fa-phone-square"></i> ${call.calledUser.username} ${this.$t('calling')}`,
						html: `<img class="rounded" src="${getProfileImagePath(call.calledUser)}" height="80" alt="${
							call.calledUser.username
						}"><br><br><span class="waiting">${this.$t('Please Wait')}...</span>`,
						showCancelButton: false,
						confirmButtonText: this.$t('Cancel'),
						showConfirmButton: true,
						timer: 30000,
						confirmButtonColor: '#c92f2f',
						allowOutsideClick: false,
					}).then((result: SweetAlertResult) => {
						this.callSound.pause();
						console.log({ result });
						if (result.isConfirmed || result.isDismissed) {
							this.$socket.emit(SocketEventType.CALL_ENDED);
							if (myStream) {
								this.removeStream(myStream);
							}
						}
					});

					const mediaConstraints: MediaStreamConstraints = {
						video: call.mediaType === 'VOICE' ? false : true,
						audio: true,
					};

					const getUserMedia =
						navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
					getUserMedia(
						mediaConstraints,
						async (stream: MediaStream) => {
							if (this.user.preference.notificationEnabled) this.playSound();
							let rs: MediaStreamWrapper;
							const callObj: MediaConnectionWithMetadata = this.peer.call(
								call.calledUser.clientId,
								stream,
								{
									metadata: call,
								},
							);
							console.log({ callObj });
							myStream = { stream, callObject: callObj, isCaller: true };
							this.handleStream(myStream, call.mediaType);

							if (!callObj) {
								return this.onCallErrorOrClose(myStream);
							}

							callObj.on('stream', (remoteStream: MediaStream) => {
								rs = { stream: remoteStream, callObject: callObj, isCaller: false };
								this.handleStream(rs, call.mediaType);
								Swal.close();
							});
							callObj.on('error', (error) => {
								this.onCallErrorOrClose(myStream, undefined, error);
							});
							callObj.on('close', () => {
								this.onCallErrorOrClose(myStream, rs);
							});
						},
						(error) => console.error(error),
					);
				}
			});
		},
	},
});
</script>

<style scoped>
.broadcast-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	flex-wrap: wrap;
}

.draggable-video {
	width: 240px;
	height: 180px;
	margin: 10px;
}
.draggable-audio {
	width: 180px;
	height: 80px;
	margin: 10px;
}
</style>
