<template>
    <div
        :class="[
            isHovered ? $style.nowPlaying : '',
            isHovered ? $style.expanded : '',
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <audio
            ref="audioRef"
            :src="streamUrl"
            @ended="handleNext"
            preload="auto"
        ></audio>

        <div v-if="!isHovered" :class="$style.compactNowPlaying">
            <span> &nbsp;{{ currentTrackDisplay }}</span>
        </div>

        <div v-if="isHovered" :class="[$style.controls]">
            <button
                v-if="!isRadio"
                :class="$style.controlButton"
                @click="handlePrevious"
            >
                <span></span>
            </button>

            <button :class="$style.controlButton" @click="handlePlayPause">
                <span>
                    <span v-if="isPlaying"></span>
                    <span v-else></span>
                </span>
            </button>

            <span :class="[$style.title]" :title="currentTrackDisplay">{{
                currentTrackDisplay
            }}</span>

            <button
                v-if="!isRadio"
                :class="$style.controlButton"
                @click="handleNext"
            >
                <span></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const streamUrl =
    'https://knkx-live-a.edge.audiocdn.com/6285_128k?aw_0_1st.playerid=jazz24.org&uuid=vyfp1tf56'

const audioRef = ref<HTMLAudioElement | null>(null)

const isHovered = ref(false)
const isPlaying = ref(false)
const isRadio = ref(true)

const currentTrack = ref({
    artist: 'Loading...',
    title: '',
})

// Compose display string
const currentTrackDisplay = computed(() => {
    if (currentTrack.value.artist && currentTrack.value.title) {
        return `${currentTrack.value.artist} - ${currentTrack.value.title}`
    }
    if (currentTrack.value.title) return currentTrack.value.title
    if (currentTrack.value.artist) return currentTrack.value.artist
    return 'Loading...'
})

// Fetch now playing info from NPR stations API
async function fetchNowPlaying() {
    try {
        const res = await fetch(
            'https://api.composer.nprstations.org/v1/widget/5182a213e1c801ca005dbe32/now?format=json&style=v2&show_song=true'
        )
        if (!res.ok) throw new Error('Failed to fetch now playing')

        const data = await res.json()
        // Extract artist and track name from the response:
        const song = data.onNow?.song || {}

        currentTrack.value.artist = song.artistName || 'Unknown Artist'
        currentTrack.value.title = song.trackName || 'Unknown Track'
    } catch (e) {
        currentTrack.value.artist = 'Error'
        currentTrack.value.title = 'Loading track'
        console.error(e)
    }
}

const handlePlayPause = () => {
    if (!audioRef.value) return

    if (isPlaying.value) {
        audioRef.value.pause()
    } else {
        audioRef.value.play()
    }

    isPlaying.value = !isPlaying.value
}

const handlePrevious = () => {
    // Streaming radio no previous, so restart stream
    if (audioRef.value) {
        audioRef.value.currentTime = 0
    }
}

const handleNext = () => {
    // Streaming radio no next, so restart stream
    if (audioRef.value) {
        audioRef.value.currentTime = 0
        audioRef.value.play()
        isPlaying.value = true
    }
}

let intervalId: number | undefined

onMounted(() => {
    fetchNowPlaying()
    intervalId = setInterval(fetchNowPlaying, 30_000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<style module>
.nowPlaying {
    font-family: 'JetBrainsMono Nerd Font', monospace;

    position: fixed;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(40, 40, 40, 0.9);
    backdrop-filter: blur(12px);
    border-radius: 18px;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    width: 60px;
    height: 28px;

    transition:
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded {
    width: 300px;
    height: 64px;
    padding: 8px 12px;
}

.compactNowPlaying {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title {
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    user-select: none;
}

.controlButton {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;
}

.controlButton:hover {
    color: #61afef;
}

.controlButton span {
    display: inline-block;
    transition: transform 0.2s ease;
}

.controlButton:hover span {
    transform: scale(1.2);
}
</style>
