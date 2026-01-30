<template>
    <div
        :class="[
            $style.nowPlaying,
            isHovered ? $style.expanded : '',
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <audio
            ref="audioRef"
            :src="currentStation.streamUrl"
            preload="auto"
        ></audio>

        <!-- Compact Mode (The "Drop") -->
        <div v-if="!isHovered" :class="$style.compactNowPlaying">
            <RadioVisualizer 
                :isAnimating="isPlaying" 
                :count="3" 
                :height="12" 
                :width="3" 
                v-if="isPlaying"
            />
            <span v-else :class="$style.musicIcon"></span>
        </div>

        <!-- Expanded "Radio" Mode (The Card) -->
        <div v-if="isHovered" :class="$style.radioContainer">
            <div :class="$style.radioHeader">
                <RadioDial 
                    :rotation="dialRotation" 
                    :range="currentStation.dialRange" 
                />
                <RadioStationDisplay 
                    :stationName="currentStation.name" 
                    :trackDisplay="currentTrackDisplay" 
                />
            </div>

            <RadioVisualizer :isAnimating="isPlaying" />

            <RadioControls 
                :isPlaying="isPlaying"
                @toggle="togglePlay"
                @nextStation="nextStation"
                @prev="prevStation"
                @next="nextStation"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRadio } from '../../composables/useRadio'
import RadioDial from './components/radio/RadioDial.vue'
import RadioVisualizer from './components/radio/RadioVisualizer.vue'
import RadioControls from './components/radio/RadioControls.vue'
import RadioStationDisplay from './components/radio/RadioStationDisplay.vue'

const isHovered = ref(false)
const {
    audioRef,
    currentStation,
    currentTrackDisplay,
    isPlaying,
    dialRotation,
    togglePlay,
    nextStation,
    prevStation
} = useRadio()
</script>

<style module>
.nowPlaying {
    font-family: var(--font-main);
    position: absolute;
    top: 50%;
    left: 57%;
    transform: translate(-50%, -50%);
    /* background: var(--color-bg-island); */
    backdrop-filter: blur(var(--blur-island));
    /* border: 1px solid var(--color-border); */
    /* border-radius: var(--radius-pill); */
    color: var(--color-text-base);
    /* box-shadow: var(--shadow-island); */
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 36px;
    height: 36px;
    padding: 0;
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color var(--transition-base), box-shadow var(--transition-base);
}

.expanded {
    width: 340px;
    height: 160px;
    padding: 16px;
    border-radius: var(--radius-base);
    background: var(--color-bg-island);
}

.compactNowPlaying {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.musicIcon {
    font-size: 16px;
    color: var(--color-primary);
}

.radioContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 12px;
    /* Gentle fade in for contents as the card expands */
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

.radioHeader {
    display: flex;
    gap: 15px;
    align-items: center;
}
</style>
