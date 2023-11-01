<template>
	<div>
		<DraggableContainer :referenceLineVisible="false" :referenceLineColor="'red'">
			<Vue3DraggableResizable
				:initW="initW"
				:initH="initH"
				:minW="minW"
				:minH="minH"
				:lockAspectRatio="lockAspectRatio"
				:draggable="true"
				:resizable="true"
			>
				<div class="broadcast" ref="widget">
					<div @click="removeStream" class="close">
						<i class="fa fa-close" aria-hidden="true"></i>
					</div>
					<div @click="toggleFullscreen" class="fullscreen">
						<i class="fa" :class="{ 'fa-compress': isFullScreen, 'fa-arrows-alt': !isFullScreen }"></i>
					</div>
					<span class="username">
						{{
							streamWrapper.isCaller
								? streamWrapper.callObject.metadata.callerUser.username
								: streamWrapper.callObject.metadata.calledUser.username
						}}
					</span>
					<div class="mute-container">
						<div @click="muteAudio" class="mute">
							<i
								class="fa"
								:class="{ 'fa-microphone': !audioMuted, 'fa-microphone-slash': audioMuted }"
								aria-hidden="true"
							></i>
						</div>
						<div v-if="isVideo" @click="muteVideo" class="mute">
							<i
								class="fas"
								:class="{ 'fa-video': !videoMuted, 'fa-video-slash': videoMuted }"
								aria-hidden="true"
							></i>
						</div>
					</div>
					<video
						v-if="isVideo"
						autoplay="true"
						playsinline="true"
						:srcObject.prop="streamWrapper.stream"
					></video>
					<video v-else autoplay="true" playsinline="true" :srcObject.prop="streamWrapper.stream"></video>
				</div>
				<!-- İçerik buraya -->
			</Vue3DraggableResizable>
		</DraggableContainer>
	</div>
</template>

<script lang="ts">
import Vue3DraggableResizable, { DraggableContainer } from 'vue3-draggable-resizable';
import { defineComponent } from 'vue';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import { MediaStreamWrapper } from '@/types';

export default defineComponent({
	components: {
		Vue3DraggableResizable,
		DraggableContainer,
	},
	data() {
		return {
			audioMuted: false,
			videoMuted: false,
			isFullScreen: false,
		};
	},
	props: {
		streamWrapper: {
			type: Object as () => MediaStreamWrapper,
			required: true,
		},
		initW: {
			type: Number,
			required: true,
		},
		initH: {
			type: Number,
			required: true,
		},
		minW: {
			type: Number,
			required: true,
		},
		minH: {
			type: Number,
			required: true,
		},
		isVideo: {
			type: Boolean,
			required: true,
		},
		lockAspectRatio: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['removeStream'],
	methods: {
		muteAudio() {
			this.streamWrapper.stream.getAudioTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			this.audioMuted = !this.audioMuted;
		},
		muteVideo() {
			this.streamWrapper.stream.getVideoTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			this.videoMuted = !this.videoMuted;
		},
		removeStream() {
			this.$emit('removeStream', this.streamWrapper);
		},
		toggleFullscreen() {
			this.isFullScreen = !this.isFullScreen;
			const widget = this.$refs.widget as any;

			const doc = document as any;
			// Eğer zaten tam ekran modunda değilse tam ekran yap
			if (!doc.fullscreenElement) {
				if (widget.requestFullscreen) {
					widget.requestFullscreen();
				} else if (widget.mozRequestFullScreen) {
					/* Firefox */
					widget.mozRequestFullScreen();
				} else if (widget.webkitRequestFullscreen) {
					/* Chrome, Safari ve Opera */
					widget.webkitRequestFullscreen();
				} else if (widget.msRequestFullscreen) {
					/* IE/Edge */
					widget.msRequestFullscreen();
				}
			} else {
				// Eğer tam ekran modunda ise tam ekran modundan çık
				if (doc.exitFullscreen) {
					doc.exitFullscreen();
				} else if (doc.mozCancelFullScreen) {
					/* Firefox */
					doc.mozCancelFullScreen();
				} else if (doc.webkitExitFullscreen) {
					/* Chrome, Safari ve Opera */
					doc.webkitExitFullscreen();
				} else if (doc.msExitFullscreen) {
					/* IE/Edge */
					doc.msExitFullscreen();
				}
			}
		},
	},
});
</script>

<style>
.broadcast {
	width: 100%;
	height: 100%;
}
.vdr-handle {
	opacity: 0 !important;
	width: 35px !important;
	height: 19px !important;
	z-index: 100;
}
.vdr-container.active {
	border: 0px !important;
	z-index: 110;
}
.vdr-handle-bl {
	height: 9px !important;
}
.mute-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 10px;
	background-color: rgba(0, 0, 0, 0.5);
}

.mute {
	margin: 0 5px;
}
</style>
