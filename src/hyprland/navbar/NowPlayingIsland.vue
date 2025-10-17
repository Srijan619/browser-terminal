<template>
    <div
        :class="[
            isHovered ? $style.nowPlaying : '',
            isHovered ? $style.expanded : '',
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <div v-if="!isHovered" :class="$style.compactNowPlaying">
            <span class="nerd-font"></span>
        </div>

        <div v-if="isHovered" :class="[$style.controls]">
            <button :class="$style.controlButton" @click="handlePrevious">
                <span class="nerd-font"></span>
            </button>
            <button :class="$style.controlButton" @click="handlePlayPause">
                <span class="nerd-font">
                    <span v-if="isPlaying"></span>
                    <span v-else></span>
                </span>
            </button>

            <span :class="[$style.title]">{{ currentTrack.title }}</span>

            <button :class="$style.controlButton" @click="handleNext">
                <span class="nerd-font"></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isHovered = ref(false)
const isPlaying = ref(false)
const currentTrack = ref({
    title: 'Mock Track - Artist',
})

const handlePlayPause = () => {
    isPlaying.value = !isPlaying.value
    // Playback logic here
}

const handlePrevious = () => {
    // Previous track logic here
}

const handleNext = () => {
    // Next track logic here
}
</script>

<style module>
.nowPlaying {
    font-family: 'JetBrainsMono Nerd Font', monospace;

    position: fixed;
    top: 5px;
    left: 55%;
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

    /* We’ll control width and height in expanded */
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
    font-size: 16px;
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
    width: 100%;
    justify-content: space-evenly;
}

.title {
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    max-width: 120px;
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

    font-family: 'JetBrainsMono Nerd Font', monospace;
    line-height: 1;
    padding: 0;
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
