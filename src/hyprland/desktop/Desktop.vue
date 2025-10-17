<template>
    <div class="desktop-container">
        <Waybar @openTerminal="handleOpenTerminal" />
        <transition name="slide-up">
            <div v-show="showTerminal" class="terminal-window">
                <Container />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Container from '../../components/TerminalContainer.vue'
import Waybar from '../navbar/WayBar.vue'

const showTerminal = ref(false)

const handleOpenTerminal = () => {
    showTerminal.value = !showTerminal.value
}
</script>

<style scoped>
.desktop-container {
    height: 100vh;
    background-image: url('desktop_wallpaper.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

/* Override background on all nested divs */
.desktop-container div {
    background-color: transparent !important;
}

/* Terminal window styling */
.terminal-window {
    max-width: 90vw;
    min-width: 90vw;
    width: 90vw;

    height: 70vh;
    min-height: 70vh;
    max-height: 70vh;

    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.15); /* subtle glassy border */
    backdrop-filter: blur(8px) saturate(1.2); /* enable blur behind */
    background-color: rgba(0, 0, 0, 0.4); /* translucent background */
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6); /* soft shadow */
    overflow: hidden;

    display: flex;
    flex-direction: column;
    padding: 0;
    font-size: small;
}

.slide-up-enter-active {
    transition: transform 0.8s ease;
}
.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}
.slide-up-enter-to {
    transform: translateY(0);
    opacity: 1;
}
</style>

<style>
.single-prompt-card {
    width: 60vw !important;
}
</style>
