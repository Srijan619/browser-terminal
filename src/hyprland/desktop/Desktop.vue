<template>
    <div class="desktop-container">
        <Waybar @openTerminal="handleOpenTerminal" />
        <transition name="slide-up">
            <WindowFrame 
                v-if="showTerminal" 
                title="Terminal" 
                @close="handleCloseTerminal" 
                @minimize="handleMinimizeTerminal"
            >
                <TerminalContainer />
            </WindowFrame>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TerminalContainer from '../../components/TerminalContainer.vue'
import Waybar from '../navbar/WayBar.vue'
import WindowFrame from './WindowFrame.vue'
import { useViewStore } from '../../stores/viewStore'

const viewStore = useViewStore()
const showTerminal = ref(viewStore.currentView === 'TERMINAL')

// Watch for store changes (optional, but good for reactivity if view changes while mounted)
watch(
    () => viewStore.currentView,
    (newVal) => {
        if (newVal === 'TERMINAL') {
            showTerminal.value = true
        }
    }
)

const handleOpenTerminal = () => {
    showTerminal.value = !showTerminal.value
}

const handleCloseTerminal = () => {
    showTerminal.value = false
}

const handleMinimizeTerminal = () => {
    showTerminal.value = false
}
</script>

<style scoped>
.desktop-container {
    height: 100vh;
    background-image: url('/desktop_wallpaper.png');
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

/* Terminal window styling handled by WindowFrame component */

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
