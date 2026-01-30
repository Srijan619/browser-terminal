<template>
    <div class="desktop-container">
        <Waybar @openTerminal="handleOpenTerminal" />
        <transition name="slide-up">
        <transition name="slide-up">
            <WindowFrame 
                v-if="showTerminal" 
                title="Terminal" 
                :isActive="isTerminalActive"
                @close="handleCloseTerminal" 
                @minimize="handleMinimizeTerminal"
                @focus="handleWindowFocus"
            >
                <TerminalContainer />
            </WindowFrame>
        </transition>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import TerminalContainer from '../../components/TerminalContainer.vue'
import Waybar from '../navbar/WayBar.vue'
import WindowFrame from './WindowFrame.vue'
import { useViewStore } from '../../stores/viewStore'

const viewStore = useViewStore()
const showTerminal = ref(viewStore.currentView === 'TERMINAL')
const isTerminalActive = ref(true)

// Watch for store changes
watch(
    () => viewStore.currentView,
    (newVal) => {
        if (newVal === 'TERMINAL') {
            showTerminal.value = true
            isTerminalActive.value = true
        }
    }
)

const handleOpenTerminal = () => {
    showTerminal.value = !showTerminal.value
    if (showTerminal.value) isTerminalActive.value = true
}

const handleCloseTerminal = () => {
    showTerminal.value = false
}

const handleMinimizeTerminal = () => {
    showTerminal.value = false
}

const handleWindowFocus = () => {
    isTerminalActive.value = true
}

// Keyboard Shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
    // Check for Meta (Command/Windows) key
    if (e.metaKey) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleOpenTerminal()
        }
        if (e.key === 'q' && showTerminal.value) {
            e.preventDefault()
            handleCloseTerminal()
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    // Click outside handler to unset active potentially? 
    // For now simple focus is fine. 
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
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
